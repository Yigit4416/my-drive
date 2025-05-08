"use server";

import { getChildFoldersWithRoute } from "~/server/queries";

// here is what we beed to do
// we will get parent route and get all childs
// after that we will compare with routeToSave
// If there is same one we will throw error

export async function compareRoutes(parentRoute: string) {
  const needToCompare = await getChildFoldersWithRoute({ route: parentRoute });
  return needToCompare;
}
