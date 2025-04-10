"use client";

import { Separator } from "@radix-ui/react-context-menu";
import { Map } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DialogContent,
  DialogTitle,
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "~/components/ui/dialog";
import { ScrollArea } from "~/components/ui/scroll-area";
import { getFolders } from "./servertoclient";
import { useEffect, useState } from "react";

type AllFolders = {
  id: number;
  name: string;
  route: string;
  parentId: number | null;
  type: string;
  size: number;
  userId: string;
};
export default function RelocateItem() {
  const [allFolders, setAllFolders] = useState<AllFolders[]>();
  useEffect(() => {
    // Do not forget to use here with async
    async function getAllFolders() {
      try {
        const result = await getFolders();
        setAllFolders(result);
      } catch (error) {
        console.error(error);
      }
    }
    getAllFolders();
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="focus:ring-primary-500 dark:focus:ring-primary-400 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-gray-100 focus:outline-none focus:ring-2 dark:text-gray-300 dark:hover:bg-gray-800">
          <Map className="h-4 w-4" />
          Relocate
        </button>
      </DialogTrigger>
      <DialogContent className="flex flex-col">
        <DialogHeader>
          <DialogTitle>New Location</DialogTitle>
        </DialogHeader>
        <div>
          <FoldersScrollArea allFolders={allFolders} />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"destructive"} className="hover:bg-red-400">
              Cancle
            </Button>
          </DialogClose>
          <Button variant={"outline"} type="submit">
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function FoldersScrollArea({
  allFolders,
}: {
  allFolders: AllFolders[] | undefined;
}) {
  const [foldersToUseState, setFoldersToUseState] = useState<AllFolders[]>();
  const [selectedFolderId, setSelectedFolderId] = useState<number>(4);

  // still need to handle go back function
  const handleClick = (folderId: number) => {
    console.log(folderId);
    console.info("button pressed");
    setSelectedFolderId(folderId);
    //if this doesn't work use selectedFolderId
    const data = foldersToUse({
      allFolders: allFolders,
      selectedFolderId: selectedFolderId,
    });
    setFoldersToUseState(data);
  };

  useEffect(() => {
    handleClick(4);
  }, []);

  if (allFolders === undefined) {
    return <div>You haven't got any folders mate</div>;
  } else {
    return (
      <ScrollArea className="h-72 w-full rounded-md border">
        <div className="p-4">
          {foldersToUseState?.map((tag, index) => (
            <div key={index} className="mb-1 border-b">
              <div className="text-sm">
                <Button variant={"link"} onClick={() => handleClick(tag.id)}>
                  {tag.name}
                </Button>
              </div>
              <Separator className="my-1" />
            </div>
          ))}
        </div>
      </ScrollArea>
    );
  }
}

function foldersToUse({
  allFolders,
  selectedFolderId,
}: {
  allFolders: AllFolders[] | undefined;
  selectedFolderId: number;
}): AllFolders[] {
  if (allFolders === undefined) {
    const data: AllFolders[] = [
      {
        id: 4,
        parentId: 0,
        name: "root",
        route: "/root",
        size: 0,
        type: "folder",
        userId: "everyone",
      },
    ];
    return data;
  } else if (selectedFolderId === undefined || selectedFolderId === null) {
    const result = allFolders.filter((folder) => folder.parentId === 4);
    console.info(result);
    return allFolders.filter((folder) => folder.parentId === 4);
  } else {
    return allFolders.filter((folder) => folder.parentId === selectedFolderId);
  }
}
