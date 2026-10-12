import type { Metadata } from "next";
import { AboutScreen } from "@/modules/marketing/components/AboutScreen";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return <AboutScreen />;
}
