import { TourInfo } from "@/components";
import { TourService } from "@/services/tour.service";
import React from "react";

const page = async ({ params }: { params: { slug: string } }) => {
  const tour = await TourService.getBySlugTour(params.slug);
  return (
    <div className={`mt-16 max-w-[1800px] mx-auto`}>
      <TourInfo data={tour} />
    </div>
  );
};

export default page;
