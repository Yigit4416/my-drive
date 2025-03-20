import "server-only";
import { auth } from "@clerk/nextjs/server";
import { db } from "./db";
import { files, folders } from "./db/schema";

export async function getFolders(id: number) {
  //Make sure that userId is walid and check with queries
  /* 
  const user = await auth();
  if(!user.userId) throw new Error("Unauthhorized")
  */
  const result = await db.query.folders.findFirst({
    where: (model, { eq }) => eq(model.id, id),
  });
  if (!result) throw new Error("Couldn't find file");
}

export async function getChildFolders(parentId: number) {
  /* 
    const user = await auth();
    if(!user.userId) throw new Error("Unauthhorized")
    */
  const result = await db.query.folders.findMany({
    where: (model, { eq }) => eq(model.parentId, parentId),
  });
  if (!result) throw new Error("There is no folder");
  return result;
}

export async function getFiles(folderId: number) {
  /* 
  const user = await auth();
  if(!user.userId) throw new Error("Unauthhorized")
  */
  const result = db.query.files.findMany({
    where: (model, { eq }) => eq(model.folderId, folderId),
  });
  if (!result) throw new Error("There is no folder");
  return result;
}

type Files = {
  name: string;
  type: string;
  folderId: number;
  route: string;
  size: number;
};

export async function createFile({ name, type, folderId, route, size }: Files) {
  /* 
  const user = await auth();
  if(!user.userId) throw new Error("Unauthhorized")
  */
    const result = await db
    .insert(files)
    .values({
      name: name,
      type: type,
      folderId: folderId,
      route: route,
      size: size,
    })
    .returning();

  if (!result) throw new Error("Couldn't insert");
  return result;
}

type Folders = {
  id: number;
  name: string;
  route: string;
  parentId: number;
  type: string;
  size: number;
};

export async function createFolder({
  id,
  name,
  type,
  parentId,
  route,
  size,
}: Folders) {
  /* 
  const user = await auth();
  if(!user.userId) throw new Error("Unauthhorized")
  */
  const result = await db
    .insert(folders)
    .values({
      id: id,
      name: name,
      route: type,
      parentId: parentId,
      type: route,
      size: size,
    })
    .returning();
  if (!result) throw new Error("Couldn't insert");
  return result;
}
