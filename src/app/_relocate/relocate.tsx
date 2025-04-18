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
import { getFolders, applyDirChange } from "./servertoclient";
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
  const [folderSelected, setFolderSelected] = useState<boolean>(true);
  const [allFolders, setAllFolders] = useState<AllFolders[]>();
  // Used ir so i won't get hydration error (makes sure that works on ONLY client)
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
    void getAllFolders();
  }, []);
  
  type ApplyDir = {
  itemId: number;
  newRouteId: number;
  type: string;
  }

  // Acaba bunun yerine bunu alıp her elementin butonunun içine gömüp sonrasında emin misin diye bir soru tarzı bir şey mi yapsamp???
  const handleApply = async ({itemId, newRouteId, type}: ApplyDir) => {
    const result = await applyDirChange({
      itemId: itemId,
      newRouteId: newRouteId,
      type: type
    })
    console.info(result)
  }

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
          <FoldersScrollArea
            allFolders={allFolders}
            setFolderSelected={setFolderSelected}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"destructive"} className="hover:bg-red-400">
              Cancel
            </Button>
          </DialogClose>
          <Button variant={"outline"} type="submit" disabled={folderSelected}>
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// set just to tidy up main func.
function FoldersScrollArea({
  allFolders,
  setFolderSelected,
}: {
  allFolders: AllFolders[] | undefined;
  setFolderSelected: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [foldersToUseState, setFoldersToUseState] = useState<AllFolders[]>();
  const [selectedFolderId, setSelectedFolderId] = useState<number>(4);

  // still need to handle go back function
  const handleClick = (folderId: number) => {
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

  const setFolder = () => {
    setFolderSelected(false);
  };

  if (allFolders === undefined) {
    return <div>You haven't got any folders mate</div>;
  } else {
    return (
      <ScrollArea className="h-72 w-full rounded-md border">
        <div className="p-4">
          {foldersToUseState?.map((tag, index) => (
            <div key={index} className="mb-1 border-b">
              <div className="flex items-center justify-between text-sm">
                <Button
                  variant={"link"}
                  onMouseDown={() => handleClick(tag.id)}
                >
                  {tag.name}
                </Button>
                <Button onMouseDown={() => setFolder()}>
                  Select this folder
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
    // Made this so i can get rid of might be undefined BUT IT WON'T ABLE TO just because i hard coded some of the staf.
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
