"use server";

import { toast } from "sonner";
import { deleteItem } from "~/server/queries";

export async function DeleteItem({
  itemId,
  type,
}: {
  itemId: number;
  type: string;
}) {
  try {
    const result = await deleteItem({ itemId, type });
  } catch (error) {
    console.error(error);
  }
}
