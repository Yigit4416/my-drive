import DataCard from "~/app/_components/data-card";
import {
  type Folders,
  folders,
  type Files,
  mockFiles,
} from "~/app/_components/mockdata";

async function OurList({ route }: { route: string }) {
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
        size={item.size}
        key={item.id}
      />
    ));
  }

  // Make sure route starts with / if your mock data expects that format
  const normalizedRoute = route.startsWith("/") ? route : `/${route}`;

  // Gets parent folder
  const folderWeWant = folder.find(
    (folder) => folder.route === normalizedRoute,
  ) ?? {
    id: 1,
    name: "route",
    parentId: 0,
    route: "/route",
  };

  // Gets childs and than merge them
  const filesWeUse = files.filter((file) => file.folderId === folderWeWant.id);
  const foldersWeUse = folders.filter(
    (folder) => folder.parentId === folderWeWant.id,
  );
  const everything = [...filesWeUse, ...foldersWeUse];

  // Prints childs
  return everything.map((item) => (
    <DataCard
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
        <OurList route="" />
      </div>
    );
  }

  const routePath = param.route.join("/");

  return (
    <div className="mt-20 flex flex-wrap justify-center gap-4">
      <OurList route={routePath} />
    </div>
  );
}
