import type { FeaturedItemsResult } from "../types/featured";
import type { OpenStatus } from "../types/open-status";
import { FeaturedItemsSection } from "./FeaturedItemsSection";
import { HeroSection } from "./HeroSection";
import { RewardsBanner } from "./RewardsBanner";
import { ValuesSection } from "./ValuesSection";

export interface HomeScreenProps {
  initialOpenStatus: OpenStatus;
  featured: FeaturedItemsResult;
  isSignedIn: boolean;
}

export function HomeScreen({ initialOpenStatus, featured, isSignedIn }: HomeScreenProps) {
  return (
    <main>
      <HeroSection initialOpenStatus={initialOpenStatus} />
      <ValuesSection />
      <FeaturedItemsSection featured={featured} />
      <RewardsBanner isSignedIn={isSignedIn} />
    </main>
  );
}
