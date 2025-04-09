"use server";

import { deleteItem } from "~/server/queries";

export async function removeItem({
  itemId,
  type,
}: {
  itemId: number;
  type: string;
}) {
  try {
    await deleteItem({ itemId: itemId, type: type });
  } catch (error) {
    console.error(error);
  }
}
