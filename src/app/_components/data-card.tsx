"use server";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "~/components/ui/dialog";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "~/components/ui/input";
import CopyButton from "./copybutton";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "~/components/ui/context-menu";
import { TrashIcon } from "lucide-react";
import { Toaster } from "~/components/ui/sonner";
import { FolderSVG, DocumentSVG, ImageSVG } from "../_allSVG/svgfuncs";
import DeleteContext from "../_deletecontextfile/deletecontext";

export default async function DataCard({
  itemId,
  name,
  type,
  route,
  size,
}: {
  itemId: number;
  name: string;
  type: string;
  route: string;
  size: number;
}) {
  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>
          <Card className="w-48">
            <Link href={route}>
              <CardHeader>
                {type === "folder" && <FolderSVG />}
                {type.includes("application") && <DocumentSVG />}
                {type.includes("image") && <ImageSVG />}
              </CardHeader>
              <CardContent>
                <div className="group relative flex flex-col">
                  <div className="mb-2 truncate font-bold">{name}</div>
                  <div className="invisible absolute -bottom-12 left-1/2 z-10 min-w-[150px] max-w-[200px] -translate-x-1/2 transform whitespace-normal break-words rounded-md bg-gray-800 p-2 text-center text-sm text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:visible group-hover:opacity-100">
                    {name}
                    <div className="absolute -top-2 left-1/2 h-0 w-0 -translate-x-1/2 transform border-b-8 border-l-8 border-r-8 border-b-gray-800 border-l-transparent border-r-transparent"></div>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>
        </ContextMenuTrigger>
        <ContextMenuContent>
          {type !== "folder" && <ShareContext />}
          <ContextMenuItem asChild>
            <RenameContext name={name} />
          </ContextMenuItem>
          <ContextMenuItem asChild>
            <DeleteContext itemId={itemId} type={type} />
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <Toaster richColors />
    </>
  );
}

function RenameContext({ name }: { name: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-black hover:bg-slate-200">
          Rename
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename file</DialogTitle>
          <DialogDescription>
            Enter a new name for this file/folder.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Name</Label>
            <Input placeholder={name} />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>Save changes</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ShareContext() {
  return (
    <ContextMenuItem asChild>
      <Dialog>
        <DialogTrigger asChild>
          <button className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-black hover:bg-blue-100">
            Share
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share link</DialogTitle>
            <DialogDescription>
              Anyone who has this link will be able to view this.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label className="sr-only">Link</Label>
              <Input
                id="link"
                defaultValue="https://ui.shadcn.com/docs/installation"
                readOnly
              />
            </div>
            <CopyButton link="for now this is not functioning properly" />
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ContextMenuItem>
  );
}
