import "server-only";
import { db } from "./db";
import { files, folders } from "./db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { deleteFileItem, deleteMultipleFiles } from "./s3";
import { NestedMiddlewareError } from "next/dist/build/utils";

export async function getFolders(id: number) {
  //Make sure that userId is walid and check with queries
  const user = await auth();
  if (!user.userId) throw new Error("Unauthorized");

  const result = await db.query.folders.findFirst({
    where: (model, { eq, and }) =>
      and(eq(model.id, id), eq(model.userId, user.userId)),
  });

  if (!result) throw new Error("Couldn't find file");
  return result;
}

export async function getChildFolders(parentId: number) {
  const user = await auth();
  if (!user.userId) throw new Error("Unauthorized");
  const result = await db.query.folders.findMany({
    where: (model, { eq, and }) =>
      and(eq(model.parentId, parentId), eq(model.userId, user.userId)),
  });
  if (!result) throw new Error("There is no folder");
  return result;
}

export async function getFiles(folderId: number) {
  const user = await auth();
  if (!user.userId) throw new Error("Unauthorized");
  const result = db.query.files.findMany({
    where: (model, { eq }) => eq(model.folderId, folderId),
  });
  if (!result) throw new Error("There is no folder");
  return result;
}

type Files = {
  name: string;
  type: string;
  folder: string;
  route: string;
  size: number;
};

export async function createFile({ name, type, folder, route, size }: Files) {
  const user = await auth();
  if (!user.userId) throw new Error("Unauthorized");

  const folderId = await getFolderIdWithRoute({
    route: folder,
    userId: user.userId,
  });
  if (!folderId) throw new Error("Couldn't find folder");
  const result = await db
    .insert(files)
    .values({
      name: name,
      type: type,
      folderId: folderId.id,
      route: route,
      size: size,
      userId: user.userId,
    })
    .returning();

  if (!result) throw new Error("Couldn't insert");
  return result;
}

type Folders = {
  name: string;
  route: string;
  parentRoute: string;
  type: string;
};

export async function createFolder({
  name,
  type,
  parentRoute,
  route,
}: Folders) {
  const user = await auth();
  if (!user.userId) throw new Error("Unauthhorized");
  const parentId = getFolderIdWithRoute({
    route: parentRoute,
    userId: user.userId,
  });
  if (!parentId) throw new Error("Couldn't find parent folder");
  const realParentId = (await parentId).id;
  const result = await db
    .insert(folders)
    .values({
      name: name,
      route: route,
      parentId: realParentId,
      type: type,
      userId: user.userId,
    })
    .returning();
  if (!result) throw new Error("Couldn't insert");
  return result;
}

export async function getFolderIdWithRoute({
  route,
  userId,
}: {
  route: string;
  userId: string;
}) {
  console.info(route);
  const result = await db.query.folders.findFirst({
    where: (model, { eq, and }) =>
      and(eq(model.route, route), eq(model.userId, userId)),
  });
  if (!result) throw new Error("Couldn't find folder");
  return result;
}

export async function getChildFoldersWithRoute({ route }: { route: string }) {
  const user = await auth();
  if (!user.userId) throw new Error("Unauthhorized");
  const result = await db.query.folders.findMany({
    where: (model, { and, eq }) =>
      and(eq(model.userId, user.userId), eq(model.route, route)),
  });

  if (!result) throw new Error("Couldn't find file.");
  return result.map((folder) => folder.route); // Extract only the route parameter
}

export async function getFileKey({ itemId }: { itemId: number }) {
  const user = await auth();
  if (!user.userId) throw new Error("Unauthhorized");
  const result = await db.query.files.findFirst({
    where: (model, { eq, and }) =>
      and(eq(model.id, itemId), eq(model.userId, user.userId)),
  });
  console.log({
    itemId,
    user,
  });
  if (!result) throw new Error("Couldn't find file.");
  return result.route;
}

export async function renameItem({
  itemId,
  type,
  newName,
}: {
  itemId: number;
  type: string;
  newName: string;
}) {
  const user = await auth();
  if (!user.userId) throw new Error("Unauthorized");

  // Validate input
  if (!newName || newName.trim() === "") {
    throw new Error("Name cannot be empty");
  }

  try {
    if (type !== "folder") {
      // For files
      const result = await db
        .update(files)
        .set({ name: newName.trim() })
        .where(and(eq(files.id, itemId), eq(files.userId, user.userId)))
        .returning();
      console.log(result);
    } else {
      // For folders
      const result = await db
        .update(folders)
        .set({ name: newName.trim() })
        .where(and(eq(folders.id, itemId), eq(folders.userId, user.userId)))
        .returning();

      if (!result || result.length === 0) {
        throw new Error("Folder not found or you don't have permission");
      }

      return result;
    }
  } catch (error) {
    console.error("Database error during rename:", error);
    throw error;
  }
}

export async function deleteItem({
  itemId,
  type,
}: {
  itemId: number;
  type: string;
}) {
  const user = await auth();
  if (!user.userId) throw new Error("Unauthorized");

  if (type !== "folder") {
    try {
      // Handle file deletion
      await deleteFileItem({ itemId: itemId });
      const result = await db
        .delete(files)
        .where(and(eq(files.id, itemId), eq(files.userId, user.userId)))
        .returning();
      return result;
    } catch (error) {
      console.log(error);
      throw new Error("Something went wrong on deleting file");
    }
  } else {
    try {
      // Handle folder deletion (recursive)
      const childFolders = await getChildFolders(itemId);

      // Process each child folder recursively
      for (const child of childFolders) {
        await deleteItem({
          itemId: child.id,
          type: child.type,
        });
      }

      // Delete files in this folder
      const folderFiles = await getFiles(itemId);
      if (folderFiles.length > 0) {
        const keys = folderFiles.map((file) => file.route);
        await deleteMultipleFiles({ itemKeys: keys });
      }

      // Finally delete this folder
      const result = await db
        .delete(folders)
        .where(and(eq(folders.id, itemId), eq(folders.userId, user.userId)))
        .returning();

      return result;
    } catch (error) {
      console.log(error);
      throw new Error("Something went wrong on deleting folder");
    }
  }
}

export async function getAllFolders() {
  const user = await auth();
  if (!user.userId) throw new Error("Unauthorized");

  const result = await db.query.folders.findMany({
    where: (model, { eq }) => eq(model.userId, user.userId),
  });

  console.log(result);

  if (result === undefined || result === null) {
    const data = [
      {
        id: 4,
        name: "root",
        route: "/root",
        parentId: 0,
        type: "folder",
        size: 0,
        userId: "foreveryone",
      },
    ];
    return data;
  }
  return result;
}

export async function relocateFunc({
  itemId,
  newRouteId,
  type,
}: {
  itemId: number;
  newRouteId: number;
  type: string;
}) {
  // rather than directly getting route get route id and then get what is that things route is and after that update the values
  // with this files also going to get easier and there wont be any conflicts.
  const user = await auth();
  if (!user.userId) throw new Error("Unauthorized");

  if (type === "folder") {
    try {
      const result = await db
        .update(folders)
        .set({
          parentId: newRouteId,
        })
        .where(and(eq(folders.id, itemId), eq(folders.userId, user.userId)))
        .returning();
      console.info(result);
      return result;
    } catch (error) {
      console.error(error);
      throw new Error(error as string);
    }
  } else {
    try {
      const result = await db
        .update(files)
        .set({
          folderId: newRouteId,
        })
        .where(and(eq(files.id, itemId), eq(files.userId, user.userId)))
        .returning();
      console.info(result);
      console.info(result);
      return result;
    } catch (error) {
      console.error(error);
      throw new Error(error as string);
    }
  }
}

export async function folderForSignUp({ userId }: { userId: string }) {
  function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  try {
    const result = await db
      .insert(folders)
      .values({
        name: "root",
        route: "/root",
        type: "folder",
        userId: userId,
        id: getRandomInt(100000, 999999),
        parentId: 0,
        size: 0,
      })
      .returning();
    return result;
  } catch (error) {
    throw new Error(error as string);
  }
}
