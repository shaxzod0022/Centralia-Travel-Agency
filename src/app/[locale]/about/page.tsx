import React from "react";
import { styles } from "@/styles/styles";
import About from "@/components/about/About";
import { getTranslations } from "next-intl/server";

const page = () => {
  return (
    <div className="mt-20">
      <AboutHead />
      <div className={`${styles.paddingCont} mx-auto max-w-[2200px]`}>
        <About />
      </div>
    </div>
  );
};

export default page;
