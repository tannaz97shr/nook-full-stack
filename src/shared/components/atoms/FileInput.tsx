"use client";

import Image from "next/image";
import type { ChangeEvent } from "react";

export interface FileInputProps {
  label: string;
  onFileSelected: (file: File) => void;
  previewUrl?: string | null;
  isUploading?: boolean;
  error?: string;
}

/** Presentational only — the actual upload-on-select flow lives in useAdminImageUpload. */
export function FileInput({ label, onFileSelected, previewUrl, isUploading, error }: FileInputProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) onFileSelected(file);
    event.target.value = "";
  }

  return (
    <div className="grid gap-[7px]">
      <span className="text-[13.5px] font-semibold text-ink-muted">{label}</span>
      <div className="flex items-center gap-3">
        {previewUrl && (
          <Image
            src={previewUrl}
            alt=""
            width={56}
            height={56}
            className="h-14 w-14 rounded-md border border-border object-cover"
          />
        )}
        <label className="cursor-pointer rounded-pill border border-border-strong bg-surface px-4 py-2 text-[13.5px] font-semibold text-ink hover:bg-sunken">
          {isUploading ? "Uploading…" : previewUrl ? "Replace photo" : "Upload photo"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={handleChange}
            disabled={isUploading}
          />
        </label>
      </div>
      {error && <span className="text-xs text-clay">{error}</span>}
    </div>
  );
}
