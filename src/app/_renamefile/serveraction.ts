"use server";

import { revalidatePath } from "next/cache";
import { renameItem } from "~/server/queries";

type renameType = {
  newName: string; // From state
  itemId: number; // From props
  type: string; // From props
};

export async function handleRenameItem({ newName, itemId, type }: renameType) {
  "use server";

  try {
    renameItem({
      itemId: itemId,
      type: type,
      newName: newName,
    });
  } catch (error) {
    console.log(error);
  } finally {
    revalidatePath("/");
  }

  console.log(`Renaming ${type} with ID ${itemId} to ${newName}`);

  // Optionally, revalidate the page or redirect
}
