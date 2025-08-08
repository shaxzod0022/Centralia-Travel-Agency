"use client";
import React, { FC } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import Link from "next/link";
import { NavbarLinkProps } from "@/interfaces/navbar.interface";
import { styles } from "@/styles/styles";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

interface Props {
  links: NavbarLinkProps[];
  hidden: boolean;
  closeMenu?: () => void;
}

const RightMenu: FC<Props> = ({ links, hidden, closeMenu }) => {
  const t = useTranslations("navbar");
  const pathname = usePathname();

  return (
    <div
      className={`absolute top-18 w-full p-4 h-svh transition-all duration-150 bg-black ${
        hidden ? "left-0" : "left-full"
      }`}
    >
      <ul className={`${styles.flexCol} items-center gap-6 w-full`}>
        <li>
          <LanguageSwitcher />
        </li>
        {links.map((item, idx) => (
          <li key={idx}>
            <Link
              onClick={closeMenu}
              className={`text-lg ${
                pathname.slice(4) === item.path.slice(1)
                  ? "text-green-600"
                  : "text-white"
              } hover:text-green-600 transition-all duration-150`}
              href={item.path}
            >
              {item.label.toUpperCase()}
            </Link>
          </li>
        ))}
        <li className={`${styles.flexCol} gap-2`}>
          <Link
            onClick={closeMenu}
            href={"/"}
            className="bg-[#1B4332] w-fit transition-all duration-100 active:bg-[#2d6c52] capitalize rounded-4xl text-white py-2.5 px-6"
          >
            {t("btn")}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default RightMenu;
