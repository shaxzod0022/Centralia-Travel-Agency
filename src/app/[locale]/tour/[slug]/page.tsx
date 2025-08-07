import { TourInfo } from "@/components";
import { styles } from "@/styles/styles";
import React from "react";

const page = () => {
  return (
    <div className={`mt-24 ${styles.paddingCont}`}>
      <TourInfo />
    </div>
  );
};

export default page;
