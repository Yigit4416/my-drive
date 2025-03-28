"use server";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { renameItem } from "~/server/queries";
import { handleRenameItem } from "./serveraction";

export default async function RenameContext({
  name,
  itemId,
  type,
}: {
  name: string;
  itemId: number;
  type: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <form action={handleRenameItem}>
          <input type="hidden" name="itemId" value={itemId} />
          <input type="hidden" name="type" value={type} />
          <button className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-black hover:bg-slate-200">
            Rename
          </button>
        </form>
      </DialogTrigger>
      <DialogContent>
        <form action={handleRenameItem}>
          <DialogHeader>
            <DialogTitle>Rename file</DialogTitle>
            <DialogDescription>
              Enter a new name for this file/folder.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Name</Label>
              <Input placeholder={name} name="newName" required />
              <input type="hidden" name="itemId" value={itemId} />
              <input type="hidden" name="type" value={type} />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit">Save changes</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
