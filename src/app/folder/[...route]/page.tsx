"use server";

import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";
import DataCard from "~/app/_components/data-card";
import {
  getChildFolders,
  getFiles,
  getFolderIdWithRoute,
} from "~/server/queries";
import SkeletonCard from "../../loading";

async function OurListContent({
  route,
  routeList,
}: {
  route: string;
  routeList: string[];
}) {
  const normalizedRoute = route.startsWith("/") ? route : `/${route}`;
  const user = await auth();
  if (!user.userId) {
    return <div>GO LOGIN YOU BASTARD</div>;
  }

  const latestRoute = routeList.at(-1);
  const currentRoute =
    latestRoute === undefined || latestRoute === "" ? "root" : normalizedRoute;

  const parentFolderId = await getFolderIdWithRoute({
    route: currentRoute,
    userId: user.userId,
  });

  const childFolders = await getChildFolders(parentFolderId.id);
  const childFiles = await getFiles(parentFolderId.id);
  const normalizedChildFiles = childFiles.map((item) => ({
    id: item.id,
    name: item.name,
    route: item.route,
    type: item.type,
    size: item.size,
    parentId: item.folderId,
    userId: item.userId,
  }));
  const allItems = [...childFolders, ...normalizedChildFiles];

  return (
    <>
      {allItems.map((item) => (
        <DataCard
          key={item.id}
          itemId={item.id}
          name={item.name}
          route={item.route}
          type={item.type}
          size={item.size}
          parentId={item.parentId}
        />
      ))}
    </>
  );
}

export default async function PhotoPage({
  params,
}: {
  params: Promise<{ route: string[] }>;
}) {
  const param = await params;
  const routeList = param.route ?? ["root"];
  const routePath = routeList.join("/");

  return (
    <div className="mt-20 flex flex-wrap justify-center gap-4">
      <Suspense fallback={<SkeletonCard />}>
        {/* await etmemiz gerekiyor çünkü OurListContent async */}
        {await OurListContent({ route: routePath, routeList })}
      </Suspense>
    </div>
  );
}
