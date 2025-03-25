"use server";

import { createFile, createFolder } from "~/server/queries";

type Folders = {
  name: string;
  route: string;
  parentRoute: string | undefined;
  type: string;
};

export async function serverCreateFolder({
  name,
  route,
  parentRoute,
  type,
}: Folders) {
  if (parentRoute === undefined) parentRoute = "root";
  try {
    const result = await createFolder({
      name: name,
      route: route,
      parentRoute: parentRoute,
      type: type,
    });
    return result;
  } catch (error) {
    console.error(error);
    return;
  }
}

type Files = {
  name: string;
  type: string;
  folder: string;
  route: string;
  size: number;
};

export async function serverCreateFile({
  name,
  type,
  folder,
  route,
  size,
}: Files) {
  try {
    const result = await createFile({
      name: name,
      type: type,
      folder: folder,
      route: route,
      size: size,
    });
    return result;
  } catch (error) {
    console.error(error);
    return;
  }
}
