import { About, AboutHead, QuickLinks } from "@/components";
import { styles } from "@/styles/styles";
import React from "react";

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
