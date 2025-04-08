import { Dialog, DialogTrigger } from "~/components/ui/dialog";

export default async function RelocateItem() {
  return(
  <Dialog>
      <DialogTrigger asChild>
        <button className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-slate-300">Relocate Item</button>
      </DialogTrigger>
    </Dialog>
  )
}
