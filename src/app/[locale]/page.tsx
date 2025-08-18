import {
  // ActivityAndStories,
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
import { CountryProps } from "@/interfaces/country.interface";
import { TourProps } from "@/interfaces/signature.interface";
import { BlogProps } from "@/interfaces/insights.interface";

const HomePage = async (): Promise<React.JSX.Element> => {
  // Fetch data with error handling and proper types
  let countries: CountryProps[] = [];
  let tours: TourProps[] = [];
  let blogs: BlogProps[] = [];

  try {
    console.log('Fetching countries data...');
    const countriesData = await CountryService.getAllCountries();
    countries = countriesData || [];
    console.log(`Countries fetched: ${countries.length} countries`);
  } catch (error) {
    console.error('Error fetching countries:', error);
    // Continue with empty array
  }

  try {
    console.log('Fetching tours data...');
    const toursData = await TourService.getAllTours();
    tours = toursData || [];
    console.log(`Tours fetched: ${tours.length} tours`);
  } catch (error) {
    console.error('Error fetching tours:', error);
    // Continue with empty array
  }

  try {
    console.log('Fetching blogs data...');
    const blogsData = await BlogService.getAllBlogs();
    blogs = blogsData || [];
    console.log(`Blogs fetched: ${blogs.length} blogs`);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    // Continue with empty array
  }

  console.log(blogs);

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
          backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), url(https://images.theconversation.com/files/622347/original/file-20240930-18-ozn5tj.jpg?ixlib=rb-4.1.0&rect=0%2C271%2C2009&q=45&auto=format&w=1356&h=668&fit=crop)`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
        className={`${styles.paddingCont} scroll-mt-16`}
      >
        <ComponentsHead langKey={2} />
        <SignatureJourneys data={tours} />
      </div>
      {/* <ActivityAndStories /> */}
      <div
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), url(https://images.theconversation.com/files/622347/original/file-20240930-18-ozn5tj.jpg?ixlib=rb-4.1.0&rect=0%2C271%2C2009&q=45&auto=format&w=1356&h=668&fit=crop)`,
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
