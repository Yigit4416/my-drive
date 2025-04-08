"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
} from "~/components/ui/dialog";
import { FormEvent, useEffect, useState } from "react";
import { Input } from "~/components/ui/input";
import { handleRenameItem } from "./serveraction";

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
    setError(null); // Reset error state

    const submittedData = {
      newName: newName, // From state
      itemId: itemId,   // From props
      type: type,       // From props
    };

    try {
      await handleRenameItem(submittedData);
      setNewName(""); // Reset input field
      setIsOpen(false); // Close the dialog on success
    } catch (err) {
      setError("Failed to rename item. Please try again."); // Set error message
      console.error(err); // Log the error for debugging
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value);
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button onClick={() => setIsOpen(true)}>Rename</button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename your file</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <form onSubmit={handleSubmit}>
                <Input
                  name="newName"
                  value={newName}
                  placeholder={name}
                  onChange={handleNameChange}
                  disabled={loading} // Disable input while loading
                />
                <input type="hidden" name="itemId" value={itemId} />
                <input type="hidden" name="type" value={type} />
                <button type="submit" disabled={loading}>
                  {loading ? "Renaming..." : "Submit"}
                </button>
              </form>
              {error && <p className="text-red-500">{error}</p>} {/* Display error message */}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

