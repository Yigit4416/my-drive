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

export default async function RelocateItem() {
  const testData = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="focus:ring-primary-500 dark:focus:ring-primary-400 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-gray-100 focus:outline-none focus:ring-2 dark:text-gray-300 dark:hover:bg-gray-800">
          <Map className="h-4 w-4" />
          Relocate
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Location</DialogTitle>
        </DialogHeader>
        <div>
          <ScrollArea className="h-72 w-48 rounded-md border">
            <div className="p-4">
              {[...testData, ...testData, ...testData, ...testData, ...testData, ...testData, ...testData, ...testData].map((tag, index) => (
                <div key={index} className="border-b mb-1">
                  <div className="text-sm">
                    {tag}
                  </div>
                  <Separator className="my-1" />
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        <DialogFooter>
          <Button variant={"outline"} type="submit">
            Apply
          </Button>
          <DialogClose asChild>
            <Button variant={"destructive"} className="hover:bg-red-400">
              Cancle
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
