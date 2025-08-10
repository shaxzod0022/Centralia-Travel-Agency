import { ComponentsHead, SignatureJourneys } from "@/components";
import { TourService } from "@/services/tour.service";
import { styles } from "@/styles/styles";
import React from "react";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function Page({ params }: Props) {
  const { locale, slug } = await params;
  const tours = await TourService.getByIdCountryTours(slug);
  return (
    <div className={`${styles.paddingCont} mt-20`}>
      <ComponentsHead langKey={5} />
      <SignatureJourneys data={tours} />
    </div>
  );
}
