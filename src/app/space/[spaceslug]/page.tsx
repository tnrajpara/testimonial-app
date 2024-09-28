"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
// import axios from "axios";
import SpaceSlugNavbar from "@/app/SlugComponents/SpaceSlugNavbar";
import SpaceSlugComponent from "@/app/SlugComponents/SpaceSlugComponent";
import SpaceSlugMenubar from "@/app/SlugComponents/SpaceSlugMenubar";
import Navbar from "@/app/components/Navbar";
import {
  TestimonialProvider,
  useTestimonials,
} from "../../contexts/TestimonialContext";

const PageContent = () => {
  const { testimonials } = useTestimonials();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  if (testimonials.length === 0) {
    return <img src="/loading.gif" />;
  }

  return (
    <>
      <Navbar />
      <div className="my-4 h-[0.2px] bg-gray-950"></div>
      <div className="flex flex-col space-y-3">
        {testimonials[0] && id && (
          <SpaceSlugNavbar
            spaceImg={testimonials[0].spaceImage}
            spaceTitle={testimonials[0].spaceTitle}
            spaceId={id}
          />
        )}
      </div>
      <div className="flex flex-end justify-center  text-gray-100 flex-col lg:flex-row">
        <SpaceSlugMenubar slugId={id} spaceTitle={testimonials[0].spaceTitle} />
        <SpaceSlugComponent spaceImg={testimonials[0].spaceImage} />
      </div>
    </>
  );
};

const Page = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  return (
    <TestimonialProvider spaceId={id}>
      <PageContent />
    </TestimonialProvider>
  );
};

export default Page;
