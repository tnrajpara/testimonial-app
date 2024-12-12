// import React from "react";
import SpaceSlugNavbar from "@/app/space/SpaceSlugNavbar";
import SpaceSlugParent from "../SpaceSlugParent";
import dbConnect from "../../../utils/dbConnect";

// import { useTestimonials } from "../../contexts/TestimonialContext";

// Define type for space data
interface SpaceData {
  spaceImage: string;
  spaceTitle: string;
  // Add other fields as needed
}

const Page = async ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  // Get ID once
  const spaceId = searchParams?.id as string;

  const { db } = await dbConnect();

  const spaceData = await db
    .collection("spaces-db")
    .findOne({ spaceId: spaceId });

  if (!spaceData) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-gray-700">
        Space not found
      </div>
    );
  }

  return (
    <>


      {spaceId && (
        <SpaceSlugNavbar
          spaceImg={spaceData.image}
          spaceTitle={spaceData.title}
          spaceId={spaceId}
        />
      )}

      <SpaceSlugParent
        spaceId={spaceId}
        spaceTitle={spaceData.title}
        spaceImg={spaceData.spaceImage}
      />
    </>
  );
};

export default Page;
