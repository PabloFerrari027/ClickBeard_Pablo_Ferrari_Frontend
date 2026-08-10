import { PublicHome } from "@/features/home/components/public-home";

/** `/`: landing acessível a visitantes e autenticados (spec §5, §13.4). Autenticados navegam para `/dashboard` a partir daqui. */
export default function HomePage() {
  return <PublicHome />;
}
