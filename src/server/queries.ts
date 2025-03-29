import "server-only";
import { db } from "./db";
import { files, folders } from "./db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { deleteFileItem, deleteMultipleFiles } from "./s3";

export async function getFolders(id: number) {
  //Make sure that userId is walid and check with queries
  const user = await auth();
  if (!user.userId) throw new Error("Unauthhorized");

  const result = await db.query.folders.findFirst({
    where: (model, { eq, and }) =>
      and(eq(model.id, id), eq(model.userId, user.userId)),
  });

  if (!result) throw new Error("Couldn't find file");
  return result;
}

export async function getChildFolders(parentId: number) {
  const user = await auth();
  if (!user.userId) throw new Error("Unauthhorized");
  const result = await db.query.folders.findMany({
    where: (model, { eq, and }) =>
      and(eq(model.parentId, parentId), eq(model.userId, user.userId)),
  });
  if (!result) throw new Error("There is no folder");
  return result;
}

export async function getFiles(folderId: number) {
  const user = await auth();
  if (!user.userId) throw new Error("Unauthhorized");
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
  if (!user.userId) throw new Error("Unauthhorized");

  console.log(`this is our folder: ${folder}`);

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
  if (route === "/root") userId = "foreveryone";
  const result = await db.query.folders.findFirst({
    where: (model, { eq, and }) =>
      and(eq(model.route, route), eq(model.userId, userId)),
  });
  if (!result) throw new Error("Couldn't find folder");
  return result;
}

/*
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
      await deleteFileItem({ itemId: itemId });
      const result = await db
        .delete(files)
        .where(and(eq(files.id, itemId), eq(files.userId, user.userId)))
        .returning();
      return result;
    } catch (error) {
      console.log(error);
      throw new Error("Something went wrong on deleting");
    }
  } else {
    try {
      const result = await db
        .delete(folders)
        .where(and(eq(folders.id, itemId), eq(folders.userId, user.userId)))
        .returning();
      return result;
    } catch (error) {
      throw new Error("Something went wrong on deleting folder");
    }
  }
}
*/

export async function getFileKey({ itemId }: { itemId: number }) {
  const user = await auth();
  if (!user.userId) throw new Error("Unauthhorized");
  const result = await db.query.files.findFirst({
    where: (model, { eq, and }) =>
      and(eq(model.id, itemId), eq(model.userId, user.userId)),
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
  if (type !== "folder") {
    try {
      await db
        .update(files)
        .set({ name: newName })
        .where(and(eq(files.id, itemId), eq(files.userId, user.userId)));
    } catch (error) {
      console.error(error);
      throw new Error("Something went wrong");
    }
  } else {
    try {
      const result = await db
        .update(folders)
        .set({ name: newName })
        .where(and(eq(folders.id, itemId), eq(folders.userId, user.userId)))
        .returning();
      return result;
    } catch (error) {
      console.error(error);
    }
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

        // Delete file records from database
        /*
        for (const file of folderFiles) {
          await db
            .delete(files)
            .where(and(eq(files.id, file.id), eq(files.userId, user.userId)));
        }
        */
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
