"use server";

import { env } from "~/env";
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
  insiderName: string;
  size: number;
};

export async function serverCreateFile({
  name,
  type,
  folder,
  insiderName,
  size,
}: Files) {
  try {
    const bucketName = env.BUCKET_NAME;
    const location = env.BUCKET_REGION;
    const result = await createFile({
      name: name,
      type: type,
      folder: folder,
      route: `https://${bucketName}.s3.${location}.amazonaws.com/${insiderName}`,
      size: size,
    });

    if (!result) {
      throw new Error("Failed to create file record");
    }

    return result;
  } catch (error) {
    console.error("File creation failed:", error);
    throw error; // Re-throw instead of returning undefined
  }
}
