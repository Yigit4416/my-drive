"use client";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

type Status = {
  value: string;
  label: string;
};

export default function FileFolderAdder({
  isFolder,
}: {
  isFolder: Status | null;
}) {
  if (isFolder === null) return null;

  if (isFolder.value === "folder") {
    return (
      <div className="mt-4">
        <form className="flex flex-col gap-4">
          <Input placeholder={`Enter ${isFolder.value} name`} />
          <Button type="submit">Add {isFolder.label}</Button>
        </form>
      </div>
    );
  } else {
    return (
      <div className="mt-4">
        <form className="flex flex-col gap-4">
          <Input placeholder={`Enter ${isFolder.value} name`} />
          <Input type="file" />
          <Button type="submit">Add {isFolder.label}</Button>
        </form>
      </div>
    );
  }
}
