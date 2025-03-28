"use client";

import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";

export default function CopyButton({ link }: { link: string }) {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(link);
    toast.success("Copied to clipboard");
  };

  return (
    <>
      <Button onClick={handleCopy} size="sm" className="px-3">
        <span className="sr-only">Copy</span>
        <Copy className="h-4 w-4" />
      </Button>
    </>
  );
}
