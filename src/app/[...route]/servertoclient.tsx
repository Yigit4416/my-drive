"use server";

import { toast } from "sonner";
import { createFolder } from "~/server/queries";

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
    if(parentRoute === undefined) parentRoute = "root"
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
