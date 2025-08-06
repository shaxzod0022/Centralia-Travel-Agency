"use client";
import React, { FC } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import Link from "next/link";
import { NavbarLinkProps } from "@/interfaces/navbar.interface";
import { styles } from "@/styles/styles";
import { useTranslations } from "next-intl";

interface Props {
  links: NavbarLinkProps[];
  hidden: boolean;
  closeMenu?: () => void;
}

const RightMenu: FC<Props> = ({ links, hidden, closeMenu }) => {
  const t = useTranslations("navbar");

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
              className="text-lg text-white hover:text-green-600 transition-all duration-150"
              href={item.label}
            >
              {item.label.slice(1).toUpperCase()}
            </Link>
          </li>
        ))}
        <li className={`${styles.flexCol} gap-2`}>
          <Link
            onClick={closeMenu}
            href={"/"}
            className="bg-green-900 w-fit hover:bg-green-700 transition-all duration-100 active:bg-green-900 capitalize rounded-4xl text-white py-2.5 px-6"
          >
            {t("btn")}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default RightMenu;
