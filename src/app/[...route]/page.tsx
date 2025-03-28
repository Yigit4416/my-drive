"use server";
import { auth } from "@clerk/nextjs/server";
import DataCard from "~/app/_components/data-card";
import {
  getChildFolders,
  getFiles,
  getFolderIdWithRoute,
  getFolders,
} from "~/server/queries";

async function OurList({
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
  const routeLength = routeList.length;
  const latestRoute = routeList[routeLength - 1];
  if (latestRoute === undefined || latestRoute === "") {
    const parentFolderId = await getFolderIdWithRoute({
      route: "root",
      userId: user.userId,
    });
    const childFolders = await getChildFolders(parentFolderId.id);
    return childFolders.map((item) => (
      <DataCard
        itemId={item.id}
        name={item.name}
        route={item.route}
        type={item.type}
        size={item.size}
        key={item.id}
      />
    ));
  }
  const parentFolderId = await getFolderIdWithRoute({
    route: normalizedRoute,
    userId: user.userId,
  });
  const childFolders = await getChildFolders(parentFolderId.id);
  const childFiles = await getFiles(parentFolderId.id);
  const allItems = [...childFiles, ...childFolders];
  return allItems.map((item) => (
    <DataCard
      itemId={item.id}
      name={item.name}
      route={item.route}
      type={item.type}
      size={item.size}
      key={item.id}
    />
  ));
}

export default async function PhotoPage({
  params,
}: {
  params: Promise<{ route: string[] }>;
}) {
  const param = await params;
  // Handle the root route case (/folder)
  if (!param.route) {
    return (
      <div className="mt-20 flex flex-wrap justify-center gap-4">
        <OurList route="/root" routeList={["root"]} />
      </div>
    );
  }

  const routePath = param.route.join("/");

  return (
    <div className="mt-20 flex flex-wrap justify-center gap-4">
      <OurList route={routePath} routeList={param.route} />
    </div>
  );
}
