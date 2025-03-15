import DataCard from "~/app/_components/data-card";
import {
  type Folders,
  folders,
  type Files,
  mockFiles,
} from "~/app/_components/mockdata";

async function OurList({ route }: { route: string }) {
  console.log("Route received:", route); // Better logging
  const folder: Folders = folders;
  const files: Files = mockFiles;

  // Add a condition for root route
  if (!route || route === "") {
    const rootFolders = folders.filter((folder) => folder.parentId === 0);
    const rootFiles = files.filter((file) => file.folderId === 0);
    const rootItems = [...rootFiles, ...rootFolders];

    return rootItems.map((item) => (
      <DataCard
        name={item.name}
        route={item.route}
        type={item.type}
        key={item.id}
      />
    ));
  }

  // Make sure route starts with / if your mock data expects that format
  const normalizedRoute = route.startsWith("/") ? route : `/${route}`;

  console.log("Looking for folder with route:", normalizedRoute);

  const folderWeWant = folder.find(
    (folder) => folder.route === normalizedRoute,
  ) ?? {
    id: 1,
    name: "route",
    parentId: 0,
    route: "/route",
  };

  console.log("Found folder:", folderWeWant);

  const filesWeUse = files.filter((file) => file.folderId === folderWeWant.id);
  const foldersWeUse = folders.filter(
    (folder) => folder.parentId === folderWeWant.id,
  );
  const everything = [...filesWeUse, ...foldersWeUse];

  return everything.map((item) => (
    <DataCard
      name={item.name}
      route={item.route}
      type={item.type}
      key={item.id}
    />
  ));
}

export default async function PhotoPage({
  params,
}: {
  params: { route?: string[] };
}) {
  // Handle the root route case (/folder)
  if (!params?.route) {
    return (
      <div className="mt-20 flex flex-wrap justify-center gap-4">
        <OurList route="" />
      </div>
    );
  }

  const routePath = params.route.join("/");

  return (
    <div className="mt-20 flex flex-wrap justify-center gap-4">
      <OurList route={routePath} />
    </div>
  );
}
