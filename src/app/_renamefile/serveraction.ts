"use server";

import { revalidatePath } from "next/cache";
import { toast } from "sonner";
import { renameItem } from "~/server/queries";

export async function handleRenameItem(formData: FormData) {
  "use server";
  const newName = formData.get("newName") as string;
  const itemId = formData.get("itemId") as string;
  const type = formData.get("type") as string;

  const itemIdAsNumber = parseInt(itemId);

  try {
    renameItem({
      itemId: itemIdAsNumber,
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
