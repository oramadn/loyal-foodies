"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Link2Icon, CheckIcon } from "lucide-react";

export function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Link copied! Paste it in #loyal-foodies");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Button variant="outline" size="sm" onClick={handleCopy}>
      {copied ? (
        <CheckIcon className="size-4 mr-1.5" />
      ) : (
        <Link2Icon className="size-4 mr-1.5" />
      )}
      {copied ? "Copied!" : "Copy link"}
    </Button>
  );
}
