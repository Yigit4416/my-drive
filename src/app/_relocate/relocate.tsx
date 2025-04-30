"use client";

import { useEffect, useState } from "react";
import { ScrollArea } from "~/components/ui/scroll-area";
import { getFolders } from "./servertoclient";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Separator } from "~/components/ui/separator";
import { Button } from "~/components/ui/button";

type AllFolders = {
  id: number;
  type: string;
  route: string;
  size: number;
  parentId: number | null;
  userId: string;
  name: string;
};

export default function RelocateItem({ itemId }: { itemId: number }) {
  const [allFolders, setAllFolders] = useState<AllFolders[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<number>(4);
  const [dialogOpen, setDialogOpen] = useState(false);

  const folderSelector = (itemId: number) => {
    setCurrentFolderId(itemId);
  };

  useEffect(() => {
    const asyncFunc = async () => {
      const result = await getFolders();
      return result;
    };

    asyncFunc().then((result) => {
      setAllFolders(result);
    });
  }, []);

  useEffect(() => {
    setCurrentFolderId(4);
  }, [dialogOpen]);

  useEffect(() => {
    setAllFolders(FoldersToShow({ allFolders, currentFolderId }));
  }, [currentFolderId]);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <button className="dark:focus:ring-primary-400 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 focus:outline-none focus:ring-2 dark:text-gray-300 dark:hover:bg-gray-800">
          Relocate
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set A New Location</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <ScrollArea className="h-72 w-96 rounded-md border">
            <div className="p-4">
              {allFolders.map((item) => (
                <div key={item.id}>
                  <div>
                    <Button
                      variant={"link"}
                      onMouseDown={() => folderSelector(item.id)}
                    >
                      {item.name} and its parentId: {item.parentId}
                    </Button>
                  </div>
                  <Separator className="my-4" />
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FoldersToShow({
  allFolders,
  currentFolderId,
}: {
  allFolders: AllFolders[];
  currentFolderId: number;
}) {
  console.log(currentFolderId);
  console.log(allFolders);
  console.log(
    allFolders.filter((folder) => folder.parentId == currentFolderId),
  );
  return allFolders.filter((folder) => folder.parentId == currentFolderId);
}
