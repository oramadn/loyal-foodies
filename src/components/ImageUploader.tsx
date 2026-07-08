"use client";

import { useRef, useState } from "react";
import { ImageIcon, XIcon, Loader2Icon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  values: string[];
  onChange: (urls: string[]) => void;
};

export function ImageUploader({ values, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList) {
    setError(null);
    const invalid = Array.from(files).find((f) => !f.type.startsWith("image/"));
    if (invalid) { setError("Only image files are allowed"); return; }
    const tooBig = Array.from(files).find((f) => f.size > 5 * 1024 * 1024);
    if (tooBig) { setError("Each image must be under 5 MB"); return; }

    setUploading(true);
    try {
      const uploaded = await Promise.all(
        Array.from(files).map(async (file) => {
          const form = new FormData();
          form.append("file", file);
          const res = await fetch("/api/upload", { method: "POST", body: form });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error ?? "Upload failed");
          return data.url as string;
        })
      );
      onChange([...values, ...uploaded]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.length) handleFiles(e.target.files);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
  }

  function removeImage(url: string) {
    onChange(values.filter((u) => u !== url));
  }

  return (
    <div className="space-y-2">
      {/* Image grid */}
      {values.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {values.map((url) => (
            <div key={url} className="relative rounded-lg border overflow-hidden aspect-video bg-muted/30 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="menu" className="w-full h-full object-contain" />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => removeImage(url)}
                className="absolute top-1 right-1 size-6 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <XIcon className="size-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Upload area */}
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className={cn(
          "flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 px-4 py-5 cursor-pointer transition-colors",
          "hover:border-muted-foreground/50 hover:bg-muted/20",
          uploading && "pointer-events-none opacity-60"
        )}
      >
        {uploading ? (
          <Loader2Icon className="size-4 text-muted-foreground animate-spin" />
        ) : (
          <PlusIcon className="size-4 text-muted-foreground" />
        )}
        <p className="text-sm text-muted-foreground">
          {uploading
            ? "Uploading…"
            : values.length > 0
            ? "Add more images"
            : "Click or drag images here"}
        </p>
        {!uploading && (
          <span className="text-xs text-muted-foreground/60 ml-auto hidden sm:block">
            PNG, JPG, WEBP · max 5 MB each
          </span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleInputChange}
      />
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  );
}
