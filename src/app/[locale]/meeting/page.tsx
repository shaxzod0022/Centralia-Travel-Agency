import { MeetiingHead, Meeting } from "@/components";
import React from "react";

export default async function MeetingPage() {
  return (
    <div className={`mt-20`}>
      <MeetiingHead />
      <Meeting />
    </div>
  );
}
