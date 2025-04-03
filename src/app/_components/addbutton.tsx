"use client";

import { Plus } from "lucide-react";
import { useMediaQuery } from "react-responsive";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import FileFolderAdder from "./filefolderadder";

type Status = {
  value: string;
  label: string;
};

const statuses: Status[] = [
  {
    value: "folder",
    label: "Folder",
  },
  {
    value: "file",
    label: "File",
  },
];

export default function AddButton({ ...ourRoutes }) {
  const isDesktop = useMediaQuery({ query: "(min-width: 768px)" });

  if (statuses[0] === undefined || statuses[1] === undefined) {
    return <div>Statuses undefined</div>;
  }

  if (isDesktop) {
    return (
      <>
        <Dialog>
          <DialogTrigger asChild>
            <button className="transform rounded-lg bg-gray-900 px-4 py-2 font-medium text-white shadow-md transition duration-200 ease-in-out hover:scale-105 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50">
              <Plus />
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add new thing</DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="folder" className="w-full">
              <TabsList className="mb-4 grid w-full grid-cols-2">
                <TabsTrigger value="folder">Folder</TabsTrigger>
                <TabsTrigger value="file">File</TabsTrigger>
              </TabsList>

              <TabsContent value="folder">
                <FileFolderAdder
                  isFolder={statuses[0]}
                  ourRoute={ourRoutes.ourRoutes}
                />
              </TabsContent>

              <TabsContent value="file">
                <FileFolderAdder
                  isFolder={statuses[1]}
                  ourRoute={ourRoutes.ourRoutes}
                />
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 shadow-sm">
      <Dialog>
        <DialogTrigger asChild>
          <button className="transform rounded-lg bg-gray-900 px-4 py-2 font-medium text-white shadow-md transition duration-200 ease-in-out hover:scale-105 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50">
            <Plus />
          </button>
        </DialogTrigger>
        <DialogContent className="rounded-lg">
          <DialogHeader>
            <DialogTitle>Add new thing</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="folder" className="w-full">
            <TabsList className="mb-4 grid w-full grid-cols-2 rounded-md">
              <TabsTrigger value="folder" className="rounded-l-md">Folder</TabsTrigger>
              <TabsTrigger value="file" className="rounded-r-md">File</TabsTrigger>
            </TabsList>
            <TabsContent value="folder">
              <FileFolderAdder
                isFolder={statuses[0]}
                ourRoute={ourRoutes.ourRoutes}
              />
            </TabsContent>
            <TabsContent value="file">
              <FileFolderAdder
                isFolder={statuses[1]}
                ourRoute={ourRoutes.ourRoutes}
              />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
