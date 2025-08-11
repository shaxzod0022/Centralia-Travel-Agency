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
          <button
            className="relative cursor-pointer flex items-center gap-2 px-5 py-2 rounded-full 
    text-white font-medium overflow-hidden group shadow-lg hover:shadow-xl transition"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 animate-gradient-x"></span>
            <span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
      translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"
            ></span>
            <span className="relative z-10">🤖</span>
            <span className="relative z-10">{t("btn")}</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default RightMenu;
