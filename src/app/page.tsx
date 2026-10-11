import type { Metadata } from "next";
import { auth } from "@/auth";
import { getFeaturedItems } from "@/modules/home/api/getFeaturedItems";
import { HomeScreen } from "@/modules/home/components/HomeScreen";
import { HOME_METADATA } from "@/modules/home/content/homeContent";
import { getOpenStatus } from "@/modules/home/lib/getOpenStatus";
import { SITE_OPEN_GRAPH } from "@/shared/site";

// Per-request on purpose: the featured row must reflect live 86 toggles and
// the open/closed badge must reflect the current Melbourne time. (The root
// layout's auth() already forces this, but don't rely on that by accident.)
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: HOME_METADATA.title },
  description: HOME_METADATA.description,
  openGraph: {
    ...SITE_OPEN_GRAPH,
    title: HOME_METADATA.title,
    description: HOME_METADATA.description,
  },
};

export default async function HomePage() {
  const [session, featured] = await Promise.all([auth(), getFeaturedItems()]);

  return (
    <HomeScreen
      initialOpenStatus={getOpenStatus(new Date())}
      featured={featured}
      isSignedIn={Boolean(session?.user)}
    />
  );
}
