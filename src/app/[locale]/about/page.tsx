import { About, AboutHead, QuickLinks } from "@/components";
import { styles } from "@/styles/styles";
import React from "react";

const page = () => {
  return (
    <div className="mt-20">
      <AboutHead />
      <div className={`${styles.flexBetween} !items-start ${styles.paddingCont} mx-auto max-w-[2200px] gap-5`}>
        <QuickLinks />
        <About />
      </div>
    </div>
  );
};

export default page;
