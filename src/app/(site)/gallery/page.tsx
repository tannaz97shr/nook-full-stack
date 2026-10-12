import type { Metadata } from "next";
import { GalleryScreen } from "@/modules/marketing/components/GalleryScreen";

export const metadata: Metadata = { title: "Gallery" };

export default function GalleryPage() {
  return <GalleryScreen />;
}
