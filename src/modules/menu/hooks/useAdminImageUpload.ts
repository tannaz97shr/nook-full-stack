"use client";

import { useState } from "react";
import { API_ROUTES } from "@/shared/api-routes";
import { api } from "@/shared/lib/axios";

/** Uploads immediately on file-select — the resulting URL is held by the caller until form submit attaches it. */
export function useAdminImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File): Promise<string | null> {
    setIsUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await api.post<{ url: string }>(API_ROUTES.admin.menu.images, formData);
      return data.url;
    } catch {
      setError("Couldn't upload that photo — try a JPEG, PNG, or WebP under 5MB");
      return null;
    } finally {
      setIsUploading(false);
    }
  }

  return { upload, isUploading, error };
}
