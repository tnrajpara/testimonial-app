"use client";

import React from "react";
import { CiHeart } from "react-icons/ci";
import { FaHeart, FaStar } from "react-icons/fa";
import UpdateModal from "../components/UpdateModal";
import axios from "axios";
import { RiDeleteBinFill } from "react-icons/ri";
import { FaPen } from "react-icons/fa6";
// import { useTestimonials } from "../contexts/TestimonialContext";
import Testimonial from "../components/Testimonial";
import { TestimonialSkeleton } from "./SpaceSlugTestimonialSkeleton";

interface TestimonialType {
  _id: string;
  type: "text" | "video";
  rating: number;
  isLiked: boolean;
  message?: string;
  attachments?: string[];
  photo?: string;
  name: string;
  email?: string;
  extraQuestions?: Record<string, string>;
  link?: string;
  uploadedAt?: Date;
  extraQuestionValues?: Record<string, string>;
}

interface SpaceSlugComponentProps {
  spaceId: string;
  spaceImg: string;
  isLoading: boolean;
}

const SpaceSlugComponent: React.FC<SpaceSlugComponentProps> = ({
  spaceId,
  spaceImg,
  isLoading
}) => {
  const [testimonials, setTestimonials] = React.useState<TestimonialType[]>([]);
  const [favorite, setFavorite] = React.useState(false);
  const [openUpdateModal, setOpenUpdateModal] = React.useState(false);

  const fetchTestimonials = async () => {
    if (!spaceId) return;

    try {
      const response = await axios.get(`/api/getTestimonials?id=${spaceId}`);
      setTestimonials(response.data.data);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    }
  };

  React.useEffect(() => {
    fetchTestimonials();
  }, [spaceId]);

  // const handleDelete = (id: string) => async () => {
  //   try {
  //     await axios.delete(`/api/deleteTestimonial/${id}`);
  //     // Refresh testimonials after deletion
  //     await fetchTestimonials();
  //   } catch (error) {
  //     console.error("Error deleting testimonial:", error);
  //   }
  // };
  // const toggleLiked = async (id: any) => {
  //   setFavorite((prevFavorite) => !prevFavorite);

  //   try {
  //     const response = await axios.put(`/api/updateLike`, {
  //       id: id,
  //       isLiked: !favorite, // Send the updated favorite status
  //     });
  //     console.log("response sent", response);
  //   } catch (error) {
  //     console.error("Error updating favorite:", error);
  //     // Revert state if there's an error
  //     setFavorite((prevFavorite) => !prevFavorite);
  //   }
  // };
  // const toggleLiked = useCallback(async () => {
  //   const newIsLiked = !testimonial.isLiked;

  //   // Optimistically update the UI
  //   setTestimonial((prev) => ({ ...prev, isLiked: newIsLiked }));

  //   try {
  //     const response = await axios.put("/api/updateLike", {
  //       id: testimonial._id,
  //       isLiked: newIsLiked,
  //     });

  //     console.log("response sent", response);

  //     // If the request fails, revert the optimistic update
  //     if (response.status !== 200) {
  //       setTestimonial((prev) => ({ ...prev, isLiked: !newIsLiked }));
  //     }
  //   } catch (error) {
  //     console.error("Error updating like status:", error);
  //     // Revert the optimistic update on error
  //     setTestimonial((prev) => ({ ...prev, isLiked: !newIsLiked }));
  //   }
  // }, [testimonial._id, testimonial.isLiked]);

  // const handleUpdate = React.useCallback(
  //   (id: string, isLiked: boolean) => {
  //     setTestimonials((prevTestimonials: any) =>
  //       prevTestimonials.map((testimonial: any) =>
  //         testimonial._id === id ? { ...testimonial, isLiked } : testimonial
  //       )
  //     );
  //   },
  //   [setTestimonials]
  // );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mx-5 md:w-5/6 auto-rows-auto">
      {isLoading ? (
        [...Array(4)].map((_, index) => (
          <TestimonialSkeleton key={index} />
        ))
      ) : testimonials.length === 0 ? (
        <p className="text-white">No Testimonials Found!</p>
      ) : (
        testimonials.map((testimonial: TestimonialType) => (
          <div key={testimonial._id} className="h-fit">
            <Testimonial testimonial={testimonial} spaceImg={spaceImg} />
          </div>
        ))
      )}
    </div>

  );
};

export default SpaceSlugComponent;
