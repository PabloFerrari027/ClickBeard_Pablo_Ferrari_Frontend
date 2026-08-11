import { PublicHome } from "@/features/home/components/public-home";

/** `/`: landing accessible to both visitors and authenticated users (spec §5, §13.4). Authenticated users navigate to `/dashboard` from here. */
export default function HomePage() {
  return <PublicHome />;
}
