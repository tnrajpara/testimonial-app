import React, { useState, useCallback, useEffect } from "react";
import { CiHeart } from "react-icons/ci";
import { FaHeart, FaStar } from "react-icons/fa";
import { RiDeleteBinFill } from "react-icons/ri";
import { FaPen } from "react-icons/fa6";
import axios from "axios";
import UpdateModal from "../components/UpdateModal";

interface TestimonialProps {
  testimonial: {
    _id: string;
    rating: number;
    isLiked: boolean;
    message: string;
    attachments: string[];
    photo: string;
    name: string;
    email: string;
    extraQuestions: Record<string, string>;
  };
  spaceImg: string;
}

const Testimonial: React.FC<TestimonialProps> = ({ testimonial, spaceImg }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  useEffect(() => {
    const favoriteString = localStorage.getItem("isFavorite");
    const favoriteData = favoriteString ? JSON.parse(favoriteString) : {};
    if (favoriteData[testimonial._id]) {
      setIsLiked(favoriteData[testimonial._id].isLiked);
    } else {
      setIsLiked(testimonial.isLiked);
    }
  }, [testimonial._id, testimonial.isLiked]);

  const toggleLiked = (testimonialId: string) => {
    const favoriteString = localStorage.getItem("isFavorite");
    const favoriteData = favoriteString ? JSON.parse(favoriteString) : {};

    // Toggle isLiked state
    const newIsLikedStatus = !isLiked;
    setIsLiked(newIsLikedStatus);

    // Update localStorage
    favoriteData[testimonialId] = {
      id: testimonialId,
      isLiked: newIsLikedStatus,
    };
    localStorage.setItem("isFavorite", JSON.stringify(favoriteData));
  };

  const handleDelete = useCallback(async () => {
    try {
      await axios.delete(`/api/deleteTestimonial/${testimonial._id}`);
    } catch (error) {
      console.error("Error deleting testimonial:", error);
    }
  }, [testimonial._id]);

  return (
    <div className="flex flex-col px-3 py-5 space-y-2 lg:mx-6 lg:my-5 mx-3 my-3 bg-[#222222] rounded-md">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {[...Array(testimonial.rating)].map((_, index) => (
            <FaStar key={index} className="text-yellow-400" />
          ))}
        </div>
        <button
          onClick={() => toggleLiked(testimonial._id)}
          className="focus:outline-none"
        >
          {isLiked ? (
            <FaHeart className="text-red-500 cursor-pointer w-8 h-8" />
          ) : (
            <CiHeart className="text-gray-400 cursor-pointer w-8 h-8" />
          )}
        </button>
      </div>

      <div className="text-sm w-full md:w-3/4">{testimonial.message}</div>

      <div className="flex overflow-x-auto space-x-2 lg:space-x-5">
        {testimonial.attachments.map((attachment, index) => (
          <img
            key={index}
            src={attachment}
            alt="attachment"
            className="w-20 h-20 rounded-md object-cover"
          />
        ))}
      </div>

      <div className="flex flex-col md:flex-row justify-between">
        <div className="flex flex-col space-y-2">
          <span>Name</span>
          <div className="flex space-x-2 items-center">
            <img
              src={testimonial.photo}
              alt="not found"
              className="rounded-full w-6 h-6 object-cover"
            />
            <h1 className="text-sm">{testimonial.name}</h1>
          </div>
          <div className="flex flex-col">
            <span>Email</span>
            <h1 className="text-sm">{testimonial.email}</h1>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          {Object.entries(testimonial.extraQuestions).map(
            ([key, value], index) => (
              <div key={index} className="flex flex-col">
                <span>{key}</span>
                <h1 className="text-sm">
                  {value === undefined || value === "" ? "Not defined" : value}
                </h1>
              </div>
            )
          )}
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          className="flex justify-center items-center text-white px-3 py-1 rounded-md"
          onClick={() => setOpenUpdateModal(true)}
        >
          <FaPen />
          <span>Edit</span>
        </button>
        <button
          className="flex justify-center items-center px-3 py-1 rounded-md"
          onClick={handleDelete}
        >
          <RiDeleteBinFill />
          <span>Delete</span>
        </button>
      </div>

      {openUpdateModal && (
        <div className="flex justify-center items-center">
          <UpdateModal
            onClose={() => setOpenUpdateModal(false)}
            testimonialId={testimonial._id}
            spaceImg={spaceImg}
          />
        </div>
      )}
    </div>
  );
};

export default Testimonial;
