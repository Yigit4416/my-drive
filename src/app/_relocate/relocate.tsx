"use client";

import { useEffect, useMemo, useState } from "react";
import { ScrollArea } from "~/components/ui/scroll-area";
import { applyDirChange, getFolders } from "./servertoclient";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Separator } from "~/components/ui/separator";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";

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
  const [rawFolders, setRawFolders] = useState<AllFolders[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<number>(4);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [folderToMove, setFolderToMove] = useState<number>(itemId);
  const [openApply, setOpenApply] = useState(true);

  useEffect(() => {
    const asyncFunc = async () => {
      const result = await getFolders();
      setRawFolders(result);
    };
    asyncFunc();
  }, []);

  useEffect(() => {
    if (dialogOpen) setCurrentFolderId(4);
  }, [dialogOpen]);

  const filteredFolders = useMemo(() => {
    return FoldersToShow({ allFolders: rawFolders, currentFolderId });
  }, [rawFolders, currentFolderId]);

  const folderSelector = (itemId: number) => {
    setCurrentFolderId(itemId);
  };

  const itemMover = (movedId: number) => {
    setFolderToMove(movedId);
    setOpenApply(false);
  };

  useEffect(() => {
    toast.error(folderToMove);
  }, [folderToMove, openApply]);

  const moveItem = async ({
    newRouteId,
    type,
  }: {
    newRouteId: number;
    type: string;
  }) => {
    try {
      const result = await applyDirChange({
        itemId: folderToMove,
        newRouteId: newRouteId,
        type: type,
      });
      console.info(result);
    } catch (error) {
      console.info(error);
    }
  };

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
              {filteredFolders.map((item) => (
                <div key={item.id}>
                  <Button
                    variant="link"
                    className="flex w-full hover:bg-slate-300 focus:bg-gray-400"
                    onMouseDown={() => itemMover(item.id)}
                  >
                    <div onMouseDown={() => folderSelector(item.id)}>
                      {item.name}
                    </div>
                  </Button>
                  <Separator className="my-4" />
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        <DialogFooter>
          <Button variant={"destructive"}>Cancel</Button>
          <Button
            variant={"secondary"}
            onMouseDown={() =>
              // check this out later again (type has problem)
              moveItem({ newRouteId: folderToMove, type: "folder" })
            }
            disabled={openApply}
          >
            Apply
          </Button>
        </DialogFooter>
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
