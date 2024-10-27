"use client";

import React from "react";
// import Widget from "../components/Widget";
import axios from "axios";
import FirstModal from "../components/WallModal/FirstModal";
import Link from "next/link";

interface SpaceSlugMenubarProps {
  slugId: string | null;
  spaceTitle: string | null;
}

const SpaceSlugMenubar: React.FC<SpaceSlugMenubarProps> = ({
  slugId,
  spaceTitle,
}) => {
  const [data, setData] = React.useState([] as any);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [openWallModal, setOpenWallModal] = React.useState<boolean>(false);

  // const fetchTestimonials = async () => {
  //   try {
  //     setError(null);
  //     const response = await axios.get(`/api/getSpaces?id=${slugId}`);
  //     setData(response.data.data);
  //     setLoading(false);
  //     console.log("widget", response.data.data);
  //   } catch (error) {
  //     console.error("Error fetching testimonials:", error);
  //     setError("Failed to load testimonials");
  //   }
  // };

  // console.log("data", data);
  console.log("id", slugId);
  console.log("title", spaceTitle);

  const onClose = () => {
    setOpenWallModal(false);
    console.log("close", openWallModal);
  };

  if (loading) {
    return <div>Loading...</div>; // Or a spinner, or a loading component
  }

  if (error) {
    return <div>{error}</div>; // Display error message
  }

  return (
    <div className="mx-3 my-3 flex flex-col p-2 w-1/4">
      <ul>
        <button
          className="bg-[#0b0b0b] px-4 py-2 w-[10rem] h-[3rem]  text-white rounded-md"
          onClick={() => {
            setOpenWallModal(true);
            console.log("open", openWallModal);
          }}
        >
          Wall of Love
        </button>
      </ul>
      {openWallModal && (
        <FirstModal
          id={slugId ?? ""}
          onClose={onClose}
          title={spaceTitle ?? ""}
        />
      )}

      <Link
        className="text-white cursor-pointer"
        href={`http://localhost:3000/testimonial/${slugId}-${spaceTitle
          ?.split("_")
          .join("-")}`}
      >
        <p>
          http://localhost:3000/testimonial/{slugId}-
          {spaceTitle?.toLowerCase().split("_").join("-")}
        </p>
      </Link>
    </div>
  );
};

export default SpaceSlugMenubar;
