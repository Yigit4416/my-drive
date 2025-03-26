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

export default function DataCard({
  name,
  type,
  route,
  size,
}: {
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
            </Link>
            <CardContent>
              <div className="flex flex-col">
                <div className="mb-2 font-bold">{name}</div>
              </div>
            </CardContent>
          </Card>
        </ContextMenuTrigger>
        <ContextMenuContent>
          {type !== "folder" && <ShareContext />}
          <ContextMenuItem asChild>
            <RenameContext name={name} />
          </ContextMenuItem>
          <ContextMenuItem asChild>
            <DeleteContext />
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <Toaster richColors />
    </>
  );
}

function DeleteContext() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-red-600 hover:bg-red-50">
          <TrashIcon className="h-4 w-4" /> Delete
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            file/folder and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
