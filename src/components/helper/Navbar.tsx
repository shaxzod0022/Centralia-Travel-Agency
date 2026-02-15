// Navbar.tsx - Server Component wrapper
// Pre-fetches translations server-side and passes to NavbarClient
import { getTranslations } from "next-intl/server";
import NavbarClient from "./NavbarClient";
import { NavigationLinks } from "@/interfaces/navbar.interface";

const Navbar = async () => {
  // Server-side translation fetching - no JS sent to client
  const t = await getTranslations("header");
  const searchT = await getTranslations("search");

  const links = t.raw("navigationLinks") as NavigationLinks[];
  const newsLabel = t("news");
  const eventsLabel = t("events");

  return (
    <NavbarClient
      links={links}
      newsLabel={newsLabel}
      eventsLabel={eventsLabel}
    />
  );
};

export default Navbar;
