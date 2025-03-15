export type Folders = {
  id: number;
  name: string;
  route: string;
  parentId: number;
  type: string;
}[];

export type Files = {
  id: number;
  name: string;
  type: string;
  folderId: number;
  route: string;
}[];

export const folders: Folders = [
  {
    id: 1,
    name: "/root",
    route: "root",
    parentId: 0,
    type: "folder",
  },
  {
    id: 2,
    name: "File 1",
    route: "/root/file_1",
    parentId: 1,
    type: "folder",
  },
  {
    id: 3,
    name: "File 2",
    route: "/root/file_2",
    parentId: 1,
    type: "folder",
  },
  {
    id: 4,
    name: "File 3",
    route: "/root/file_1/file_3",
    parentId: 2,
    type: "folder",
  },
  {
    id: 5,
    name: "File 4",
    route: "/root/file_2/file_4",
    parentId: 3,
    type: "folder",
  },
];

export const mockFiles: Files = [
  {
    id: 1,
    name: "mpypdf1.pdf",
    type: "pdf",
    folderId: 1,
    route: "Dont't forget to add their folders route to this route",
  },
  {
    id: 2,
    name: "myimage2.png",
    type: "png",
    folderId: 2,
    route: "Dont't forget to add their folders route to this route",
  },
  {
    id: 3,
    name: "mpypdf3.pdf",
    type: "pdf",
    folderId: 3,
    route: "Dont't forget to add their folders route to this route",
  },
  {
    id: 4,
    name: "mpypdf4.pdf",
    type: "pdf",
    folderId: 4,
    route: "Dont't forget to add their folders route to this route",
  },
  {
    id: 5,
    name: "mpypdf5.pdf",
    type: "pdf",
    folderId: 5,
    route: "Dont't forget to add their folders route to this route",
  },
];
