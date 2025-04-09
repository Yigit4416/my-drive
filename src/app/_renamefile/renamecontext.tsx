"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
  DialogDescription,
} from "~/components/ui/dialog";
import { FormEvent, useEffect, useState } from "react";
import { Input } from "~/components/ui/input";
import { handleRenameItem } from "./serveraction";
import { Button } from "~/components/ui/button";
import { PencilIcon } from "lucide-react";

export default function RenameContext({
  name,
  itemId,
  type,
}: {
  name: string;
  itemId: number;
  type: string;
}) {
  const [newName, setNewName] = useState(name); // Initialize with the current name
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false); // State to manage dialog open/close

  // Update newName only on the client side
  useEffect(() => {
    setNewName(name);
  }, [name]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate input
    if (!newName.trim()) {
      setError("Name cannot be empty");
      setLoading(false);
      return;
    }

    const submittedData = {
      newName: newName.trim(),
      itemId: itemId,
      type: type,
    };

    try {
      const response = await handleRenameItem(submittedData);
      setIsOpen(false);
    } catch (err) {
      setError("Failed to rename item. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value);
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button className="focus:ring-primary-500 dark:focus:ring-primary-400 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 focus:outline-none focus:ring-2 dark:text-gray-300 dark:hover:bg-gray-800">
            <PencilIcon className="h-4 w-4" />
            Rename
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Rename File
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
              Enter a new name for "{name}".
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3">
              <Input
                className="w-full"
                name="newName"
                value={newName}
                placeholder={name}
                onChange={handleNameChange}
                disabled={loading}
              />
              <Button type="submit" disabled={loading}>
                {loading ? "Renaming..." : "Rename"}
              </Button>
              {error && <p className="text-sm text-red-500">{error}</p>}
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
