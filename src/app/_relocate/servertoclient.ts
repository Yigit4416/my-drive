"use server";

import { getAllFolders, relocateFunc } from "~/server/queries";

export async function getFolders() {
  try {
    const result = await getAllFolders();
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
    throw new Error(error as string);
  }
}

export async function applyDirChange({
  itemId,
  newRouteId,
  type,
}: {
  itemId: number;
  newRouteId: number;
  type: string;
}) {
  try {
    const result = await relocateFunc({
      itemId: itemId,
      newRouteId: newRouteId,
      type: type,
    });
    return result;
  } catch (error) {
    console.error(error);
  }
}
