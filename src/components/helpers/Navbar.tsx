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

const Navbar = () => {
  const [close, setClose] = useState<boolean>(false);
  const t = useTranslations("navbar");
  const links: NavbarLinkProps[] = t.raw("links");

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
                className="text-lg font-semibold hover:text-green-600 transition-all duration-150"
                href={item.label}
              >
                {item.label.slice(1).toUpperCase()}
              </Link>
            </li>
          ))}
          <li className={`${styles.flex} gap-2`}>
            <LanguageSwitcher />
            <Link
              href={"/"}
              className="bg-green-900 hover:bg-green-700 transition-all duration-100 active:bg-green-900 capitalize rounded-4xl text-white py-2.5 px-6"
            >
              {t("btn")}
            </Link>
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
