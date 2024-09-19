import React from "react";
import { CiHeart } from "react-icons/ci";
import { FaHeart, FaStar } from "react-icons/fa";
import UpdateModal from "../components/UpdateModal";
import axios from "axios";
import { RiDeleteBinFill } from "react-icons/ri";
import { FaPen } from "react-icons/fa6";
import { useTestimonials } from "../contexts/TestimonialContext";
import Testimonial from "./Testimonial";

interface SpaceSlugComponentProps {
  spaceImg: string;
}

const SpaceSlugComponent: React.FC<SpaceSlugComponentProps> = ({
  spaceImg,
}) => {
  const { testimonials, setTestimonials } = useTestimonials();
  const [favorite, setFavorite] = React.useState(false);
  const [openUpdateModal, setOpenUpdateModal] = React.useState(false);

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

  const handleUpdate = React.useCallback(
    (id: string, isLiked: boolean) => {
      setTestimonials((prevTestimonials: any) =>
        prevTestimonials.map((testimonial: any) =>
          testimonial._id === id ? { ...testimonial, isLiked } : testimonial
        )
      );
    },
    [setTestimonials]
  );

  return (
    <div className="w-full md:w-3/5 flex mx-5 min-w-screen flex-col space-y-5">
      {testimonials.map((testimonial: any) => {
        return (
          <>
            <Testimonial testimonial={testimonial} spaceImg={spaceImg} />
          </>
        );
      })}
    </div>
  );
};

export default SpaceSlugComponent;
