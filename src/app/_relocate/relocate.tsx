"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
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
import { useRouter } from "next/navigation";

type AllFolders = {
  id: number;
  type: string;
  route: string;
  size: number;
  parentId: number | null;
  userId: string;
  name: string;
};

export default function RelocateItem({
  itemId,
  type,
  parentId,
  name,
}: {
  itemId: number;
  type: string;
  parentId: number | null;
  name: string;
}) {
  const router = useRouter();
  const [rawFolders, setRawFolders] = useState<AllFolders[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<number>(4);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isApplyDisabled, setIsApplyDisabled] = useState(true);
  const [folderWillGoThere, setFolderWillGoThere] = useState<number>(4);
  if (parentId === null) parentId = 4;

  useEffect(() => {
    const asyncFunc = async () => {
      const result = await getFolders();
      setRawFolders(result);
    };
    asyncFunc();
  }, []);

  useEffect(() => {
    if (dialogOpen) setCurrentFolderId(itemId);
  }, [dialogOpen]);

  const filteredFolders = useMemo(() => {
    return foldersToShow({
      allFolders: rawFolders,
      currentFolderId: currentFolderId,
      parentId: parentId,
    });
  }, [rawFolders, currentFolderId]);

  const handleFolderClick = (folderId: number) => {
    setFolderWillGoThere(folderId);
    setIsApplyDisabled(false);
  };

  const handleDoubleClick = (folderId: number) => {
    setCurrentFolderId(folderId);
    setFolderWillGoThere(folderId);
    setIsApplyDisabled(false);
  };

  const moveItem = async ({
    newRouteId,
    type,
  }: {
    newRouteId: number;
    type: string;
  }) => {
    try {
      const result = await applyDirChange({
        itemId,
        newRouteId,
        type,
      });
      console.info(result);
      router.refresh();
      setDialogOpen(false);
    } catch (error) {
      console.error(error);
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
          <DialogTitle>Set a new location for {name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <ScrollArea className="h-72 w-96 rounded-md border">
            <div className="p-4">
              <Suspense fallback={<div>Loading...</div>}>
                {filteredFolders.map((item) => (
                  <div key={item.id}>
                    <Button
                      variant="link"
                      className="flex w-full hover:bg-slate-300 focus:bg-gray-400"
                      onMouseDown={() => handleFolderClick(item.id)}
                      onDoubleClick={() => handleDoubleClick(item.id)}
                    >
                      {item.name}
                    </Button>
                    <Separator className="my-4" />
                  </div>
                ))}
              </Suspense>
            </div>
          </ScrollArea>
        </div>
        <DialogFooter>
          <Button variant="destructive" onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="secondary"
            onMouseDown={() =>
              moveItem({ newRouteId: folderWillGoThere, type })
            }
            disabled={isApplyDisabled}
          >
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function foldersToShow({
  allFolders,
  currentFolderId,
  parentId,
}: {
  allFolders: AllFolders[];
  currentFolderId: number;
  parentId: number;
}) {
  return allFolders.filter(
    (folder) => folder.parentId === parentId && folder.id !== currentFolderId,
  );
}
