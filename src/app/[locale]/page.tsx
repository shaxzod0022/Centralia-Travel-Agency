import {
  ActivityAndStories,
  ComponentsHead,
  Countries,
  Head,
  SignatureJourneys,
  TravelersComment,
  TravelInsights,
} from "@/components";
import { BlogService } from "@/services/blog.service";
import { CountryService } from "@/services/country.service";
import { TourService } from "@/services/tour.service";
import { styles } from "@/styles/styles";
import React from "react";

const HomePage = async () => {
  const countries = await CountryService.getAllCountries();
  const tours = await TourService.getAllTours();
  const blogs = await BlogService.getAllBlogs();
  return (
    <div className={`mt-10`}>
      <Head />
      <div
        id="tours"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), url(https://images.theconversation.com/files/622347/original/file-20240930-18-ozn5tj.jpg?ixlib=rb-4.1.0&rect=0%2C271%2C4025%2C2009&q=45&auto=format&w=1356&h=668&fit=crop)`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
        className={`${styles.paddingCont} scroll-mt-16`}
      >
        <ComponentsHead langKey={1} />
        <Countries data={countries} />
      </div>
      <div
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), url(https://images.theconversation.com/files/622347/original/file-20240930-18-ozn5tj.jpg?ixlib=rb-4.1.0&rect=0%2C271%2C4025%2C2009&q=45&auto=format&w=1356&h=668&fit=crop)`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
        className={`${styles.paddingCont} scroll-mt-16`}
      >
        <ComponentsHead langKey={2} />
        <SignatureJourneys data={tours} />
      </div>
      <ActivityAndStories />
      <div
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), url(https://images.theconversation.com/files/622347/original/file-20240930-18-ozn5tj.jpg?ixlib=rb-4.1.0&rect=0%2C271%2C4025%2C2009&q=45&auto=format&w=1356&h=668&fit=crop)`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
        className={`${styles.paddingCont} scroll-mt-16`}
      >
        <ComponentsHead langKey={3} />
        <TravelersComment />
      </div>
      <div className={`${styles.paddingCont} bg-[#F8F9FA] scroll-mt-16`}>
        <ComponentsHead langKey={4} />
        <TravelInsights data={blogs} />
      </div>
    </div>
  );
};

export default HomePage;
