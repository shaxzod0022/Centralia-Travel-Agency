import { ComponentsHead, SignatureJourneys } from "@/components";
import { TourService } from "@/services/tour.service";
import { styles } from "@/styles/styles";
import React from "react";

const page = async ({ params }: { params: { slug: string } }) => {
  console.log(params.slug);
  const tours = await TourService.getByIdCountryTours(params.slug);
  return (
    <div className={`${styles.paddingCont} mt-20`}>
      <ComponentsHead langKey={5} />
      <SignatureJourneys data={tours} />
    </div>
  );
};

export default page;
