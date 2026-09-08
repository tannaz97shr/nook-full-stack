import type { Metadata } from "next";
import { ContactScreen } from "@/modules/marketing/components/ContactScreen";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return <ContactScreen />;
}
