export type Folders = {
  id: number;
  name: string;
  route: string;
  parentId: number;
}[];

export type Files = {
  id: number;
  name: string;
  type: string;
  folderId: number;
}[];

export const folders: Folders = [
  {
    id: 1,
    name: "/",
    route: "/root",
    parentId: 0,
  },
  {
    id: 2,
    name: "File 1",
    route: "/root/file_1",
    parentId: 1,
  },
  {
    id: 3,
    name: "File 2",
    route: "/root/file_2",
    parentId: 1,
  },
  {
    id: 4,
    name: "File 3",
    route: "root/file_1/file_3",
    parentId: 2,
  },
  {
    id: 5,
    name: "File 4",
    route: "root/file_2/file_4",
    parentId: 3,
  },
];

export const mockFiles: Files = [
  {
    id: 1,
    name: "mpypdf.pdf",
    type: "pdf",
    folderId: 1,
  },
  {
    id: 2,
    name: "myimage.png",
    type: "png",
    folderId: 2,
  },
  {
    id: 3,
    name: "mpypdf.pdf",
    type: "pdf",
    folderId: 3,
  },
  {
    id: 4,
    name: "mpypdf.pdf",
    type: "pdf",
    folderId: 4,
  },
  {
    id: 5,
    name: "mpypdf.pdf",
    type: "pdf",
    folderId: 5,
  },
];
