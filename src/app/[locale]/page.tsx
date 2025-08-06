import {
  ActivityAndStories,
  Countries,
  Head,
  SignatureJourneys,
  TravelersComment,
  TravelInsights,
} from "@/components";
import React from "react";

const HomePage = async () => {
  //   const blogs = await BlogService.getAllBlogs();
  return (
    <div className={`mt-16`}>
      <Head />
      <Countries />
      <SignatureJourneys />
      <ActivityAndStories />
      <TravelersComment />
      <TravelInsights />
    </div>
  );
};

export default HomePage;
