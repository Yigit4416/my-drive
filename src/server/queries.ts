import "server-only";
import { db } from "./db";
import { files, folders } from "./db/schema";
import { auth } from "@clerk/nextjs/server";

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
    const user = await auth();
    if(!user.userId) throw new Error("Unauthhorized")
  const result = await db.query.folders.findMany({
    where: (model, { eq }) => eq(model.parentId, parentId),
  });
  if (!result) throw new Error("There is no folder");
  return result;
}

export async function getFiles(folderId: number) {
  const user = await auth();
  if(!user.userId) throw new Error("Unauthhorized")
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
  const user = await auth();
  if(!user.userId) throw new Error("Unauthhorized")
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
  if(!user.userId) throw new Error("Unauthhorized")
  console.log(parentRoute)
  const parentId = getFolderId(parentRoute);
  if (!parentId) throw new Error("Couldn't find parent folder");
  const realParentId = (await parentId).id;
  const result = await db
    .insert(folders)
    .values({
      name: name,
      route: route,
      parentId: realParentId,
      type: type,
    })
    .returning();
  if (!result) throw new Error("Couldn't insert");
  return result;
}

export async function getFolderId(route: string) {
  console.log(route)
  const result = await db.query.folders.findFirst({
    where: (model, { eq }) => eq(model.name, route),
  });
  console.log(result)
  if (!result) throw new Error("Couldn't find folder");
  return result;
}