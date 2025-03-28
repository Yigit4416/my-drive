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
import CopyButton from "../_sharefolder/copybutton";
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
import { ShareContext } from "../_sharefolder/sharecontext";
import RenameContext from "../_renamefile/renamecontext";
import { Suspense } from "react";

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
          {type !== "folder" && <ShareContext itemLink={route} />}
          <ContextMenuItem asChild>
            <Suspense fallback={<div>Loading...</div>}>
              <RenameContext name={name} itemId={itemId} type={type} />
            </Suspense>
          </ContextMenuItem>
          <ContextMenuItem asChild>
            <Suspense fallback={<div>Loading...</div>}>
              <DeleteContext itemId={itemId} type={type} />
            </Suspense>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <Toaster richColors />
    </>
  );
}
