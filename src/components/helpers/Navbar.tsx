"use client";
import { NavbarLinkProps } from "@/interfaces/navbar.interface";
import { styles } from "@/styles/styles";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React, { useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import { AlignJustify, X } from "lucide-react";
import RightMenu from "./RightMenu";
import { Logo } from "@/assets";
import Image from "next/image";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [close, setClose] = useState<boolean>(false);
  const t = useTranslations("navbar");
  const links: NavbarLinkProps[] = t.raw("links");
  const pathname = usePathname();

  return (
    <div className="bg-white z-50 fixed top-0 w-full">
      <div
        className={`${styles.flexBetween} mx-auto max-w-[2200px] w-full navbar_shadow sm:px-12 md:px-20 lg:px-28 xl:px-40 2xl:px-52 lg:py-6 p-4`}
      >
        <div>
          <Link href={"/"}>
            <Image className="w-36" src={Logo} alt="Logo" />
          </Link>
        </div>
        <ul className={`${styles.flex} gap-10 lg:flex hidden`}>
          {links.map((item, idx) => (
            <li key={idx}>
              <Link
                className={`text-lg font-semibold hover:text-green-600 transition-all duration-150 ${
                  pathname.slice(4) === item.path.slice(1) && "text-green-600"
                }`}
                href={item.path}
              >
                {item.label.toUpperCase()}
              </Link>
            </li>
          ))}
          <li className={`${styles.flex} gap-2`}>
            <LanguageSwitcher />
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
        <div className="lg:hidden block">
          <button
            onClick={() => setClose((i) => !i)}
            className="cursor-pointer"
          >
            {close ? <X /> : <AlignJustify />}
          </button>
          <RightMenu
            closeMenu={() => setClose(false)}
            links={links}
            hidden={close}
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
