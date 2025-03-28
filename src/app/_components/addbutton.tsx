"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "~/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
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

function StatusList({
  setOpen,
  setSelectedStatus,
}: {
  setOpen: (open: boolean) => void;
  setSelectedStatus: (status: Status | null) => void;
}) {
  return (
    <Command>
      <CommandInput placeholder="Filter status..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {statuses.map((status) => (
            <CommandItem
              key={status.value}
              value={status.value}
              onSelect={(value) => {
                setSelectedStatus(
                  statuses.find((priority) => priority.value === value) ?? null,
                );
                setOpen(false);
              }}
            >
              {status.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

export default function AddButton({ ...ourRoutes }) {
  const allRoutes = ourRoutes.ourRoutes;
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery({ query: "(min-width: 768px)" });
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
  if (isDesktop) {
    return (
      <>
        <Dialog>
          <DialogTrigger asChild>
            <button className="transform rounded-lg bg-gray-900 px-4 py-2 font-medium text-white shadow-md transition duration-200 ease-in-out hover:scale-105 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50">
              <Plus />
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add new thing</DialogTitle>
            </DialogHeader>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[150px] justify-start">
                  {selectedStatus ? (
                    <>{selectedStatus.label}</>
                  ) : (
                    <>Folder or File</>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0" align="start">
                <StatusList
                  setOpen={setOpen}
                  setSelectedStatus={setSelectedStatus}
                />
              </PopoverContent>
            </Popover>
            <FileFolderAdder
              isFolder={selectedStatus}
              ourRoute={ourRoutes.ourRoutes}
            />
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <button className="transform rounded-lg bg-gray-900 px-4 py-2 font-medium text-white shadow-md transition duration-200 ease-in-out hover:scale-105 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50">
            <Plus />
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add new thing</DialogTitle>
          </DialogHeader>
          <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
              <Button className="w-[150px] justify-start">
                {selectedStatus ? (
                  <>{selectedStatus.label}</>
                ) : (
                  <>Folder or File</>
                )}
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="mt-4 border-t">
                <StatusList
                  setOpen={setOpen}
                  setSelectedStatus={setSelectedStatus}
                />
              </div>
            </DrawerContent>
          </Drawer>
          <FileFolderAdder
            isFolder={selectedStatus}
            ourRoute={ourRoutes.ourRoutes}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
