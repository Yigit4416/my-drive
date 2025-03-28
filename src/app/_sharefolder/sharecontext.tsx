import { Label } from "@radix-ui/react-context-menu";
import { ContextMenuItem } from "~/components/ui/context-menu";
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
import { Button } from "~/components/ui/button";
import CopyButton from "./copybutton";

export async function ShareContext({ itemLink }: { itemLink: string }) {
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
              <Input id="link" defaultValue={itemLink} readOnly />
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
