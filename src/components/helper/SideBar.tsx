"use client";
import { NavigationLinks } from "@/interfaces/navbar.interface";
import { styles } from "@/styles/styles";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import XBtn from "./XBtn";

interface Props {
  onClose?: () => void;
  show: boolean;
}

const SideBar = ({ onClose, show }: Props) => {
  const t = useTranslations("header");
  const pathname = usePathname();
  const links = t.raw("navigationLinks") as NavigationLinks[];

  return (
    <div
      className={`bg-white lg:hidden flex flex-col justify-between w-full min-h-screen fixed top-0 z-50 transition-all duration-300 ${show ? "right-0" : "-right-full"
        }`}
    >
      <div>
        <div className={`bg-[#6EBB2D] ${styles.flexEnd} p-3 mb-2`}>
          <XBtn onClick={onClose} newClass="text-white" />
        </div>
        <div className={`bg-white`}>
          <ul className={`${styles.flexCol} px-2 w-full`}>
            {links.map((link, idx) => (
              <li key={idx}>
                <Link
                  onClick={onClose}
                  className={`${pathname === link.path && "bg-[#6EBB2D] text-white"
                    } rounded text-xl px-3 py-2 hover:bg-[#6EBB2D66] transition font-semibold w-full block`}
                  href={link.path}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                onClick={onClose}
                className={`${pathname === "/news" && "bg-[#6EBB2D] text-white"
                  } rounded text-xl px-3 py-2 hover:bg-[#6EBB2D66] transition font-semibold w-full block`}
                href={`/news`}
              >
                {t("news")}
              </Link>
            </li>
            <li>
              <Link
                onClick={onClose}
                className={`${pathname === "/events" && "bg-[#6EBB2D] text-white"
                  } rounded text-xl px-3 py-2 hover:bg-[#6EBB2D66] transition font-semibold w-full block`}
                href={`/events`}
              >
                {t("events")}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
