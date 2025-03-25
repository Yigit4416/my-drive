export type Folders = {
  id: number;
  name: string;
  route: string;
  parentId: number;
  type: string;
  size: number;
}[];

export type Files = {
  id: number;
  name: string;
  type: string;
  folderId: number;
  route: string;
  size: number;
}[];

export const folders: Folders = [
  {
    id: 1,
    name: "/root",
    route: "root",
    parentId: 0,
    type: "folder",
    size: 25,
  },
  {
    id: 2,
    name: "File 1",
    route: "/root/file_1",
    parentId: 1,
    type: "folder",
    size: 10,
  },
  {
    id: 3,
    name: "File 2",
    route: "/root/file_2",
    parentId: 1,
    type: "folder",
    size: 10,
  },
  {
    id: 4,
    name: "File 3",
    route: "/root/file_1/file_3",
    parentId: 2,
    type: "folder",
    size: 5,
  },
  {
    id: 5,
    name: "File 4",
    route: "/root/file_2/file_4",
    parentId: 3,
    type: "folder",
    size: 5,
  },
  {
    id: 6,
    name: "File 5",
    route: "/root/file_1/file_3/File 5",
    parentId: 4,
    type: "folder",
    size: 5,
  }
];

export const mockFiles: Files = [
  {
    id: 1,
    name: "mpypdf1.pdf",
    type: "pdf",
    folderId: 1,
    route: "Dont't forget to add their folders route to this route",
    size: 5,
  },
  {
    id: 2,
    name: "myimage2.png",
    type: "png",
    folderId: 2,
    route: "Dont't forget to add their folders route to this route",
    size: 5,
  },
  {
    id: 3,
    name: "mpypdf3.pdf",
    type: "pdf",
    folderId: 3,
    route: "Dont't forget to add their folders route to this route",
    size: 5,
  },
  {
    id: 4,
    name: "mpypdf4.pdf",
    type: "pdf",
    folderId: 4,
    route: "Dont't forget to add their folders route to this route",
    size: 5,
  },
  {
    id: 5,
    name: "mpypdf5.pdf",
    type: "pdf",
    folderId: 5,
    route: "Dont't forget to add their folders route to this route",
    size: 5,
  },
  {
    id: 6,
    name: "mpypdf6.pdf",
    type: "pdf",
    folderId: 6,
    route: "Dont't forget to add their folders route to this route",
    size: 5,
  }
];
