"use client";

import { useRef, useState } from "react";
import { ImageIcon, XIcon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  onChange: (url: string) => void;
  label?: string;
};

export function ImageUploader({ value, onChange, label = "Menu image" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      onChange(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function handleClear() {
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  }

  if (value) {
    return (
      <div className="relative rounded-lg border overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={value} alt={label} className="max-h-48 w-full object-contain bg-muted/30" />
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 size-7 opacity-80 hover:opacity-100"
          onClick={handleClear}
        >
          <XIcon className="size-3.5" />
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 px-4 py-8 text-center cursor-pointer transition-colors",
          "hover:border-muted-foreground/50 hover:bg-muted/20",
          uploading && "pointer-events-none opacity-60"
        )}
      >
        {uploading ? (
          <Loader2Icon className="size-6 text-muted-foreground animate-spin" />
        ) : (
          <ImageIcon className="size-6 text-muted-foreground" />
        )}
        <p className="text-sm text-muted-foreground">
          {uploading ? "Uploading…" : "Click or drag an image here"}
        </p>
        <p className="text-xs text-muted-foreground/60">PNG, JPG, WEBP up to 5 MB</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
      />
      {error && <p className="text-destructive text-xs mt-1.5">{error}</p>}
    </div>
  );
}
