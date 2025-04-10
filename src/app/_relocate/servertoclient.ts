"use server";

import { getAllFolders } from "~/server/queries";

export async function getFolders() {
  try {
    const result = await getAllFolders();
    console.log(result)
    return result;
  } catch (error) {
    console.error(error);
    throw new Error(error as string)
  }
}
