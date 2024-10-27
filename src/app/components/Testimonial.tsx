"use client";

import React, { useState, useCallback, useEffect } from "react";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { RiDeleteBinFill } from "react-icons/ri";
import { FaPen } from "react-icons/fa6";
import axios from "axios";
import UpdateModal from "./UpdateModal";
import UpdateVideoModal from "./UpdateVideoModal";
import VideoPlayer from "./VideoPlayer";
import { IoMdStar } from "react-icons/io";

interface TestimonialProps {
  testimonial: {
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
  };
  spaceImg: string;
}

const Testimonial: React.FC<TestimonialProps> = ({ testimonial, spaceImg }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openVideoUpdateModal, setVideoUpdateModal] = useState(false);

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

    const newIsLikedStatus = !isLiked;
    setIsLiked(newIsLikedStatus);

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

  const renderRating = (rating: number) => (
    <div className="flex items-center">
      {[...Array(rating)].map((_, index) => (
        <IoMdStar key={index} className="text-secondary-color text-3xl" />
      ))}
    </div>
  );
  const renderContent = () => {
    const [isVideoExpanded, setIsVideoExpanded] = useState(false);

    if (testimonial.type === "text") {
      return (
        <>
          <div className="text-sm w-full md:w-3/4 lg:text-lg">
            {testimonial.message}
          </div>
          <div className="flex overflow-x-auto space-x-2 lg:space-x-5">
            {testimonial.attachments?.map((attachment, index) => (
              <img
                key={index}
                src={attachment}
                alt="attachment"
                className="w-20 h-20 rounded-md object-cover"
              />
            ))}
          </div>
        </>
      );
    } else if (testimonial.type === "video" && testimonial.link) {
      return (
        <VideoPlayer
          videoId={testimonial.link.split("/").pop()}
          isExpanded={isVideoExpanded}
          onToggleExpand={() => setIsVideoExpanded(!isVideoExpanded)}
        />
      );
    }
    return null;
  };

  const renderDetails = () => {
    const details =
      testimonial.type === "video"
        ? testimonial.extraQuestionValues
        : testimonial.extraQuestions;

    return (
      <div className="flex flex-col space-y-2">
        {details &&
          Object.entries(details).map(([key, value], index) => (
            <div key={index} className="flex flex-col">
              <span className="font-semibold text-lg  first-letter:capitalize">
                {key}
              </span>
              <h1 className="text-sm">
                {value === undefined || value === "" ? "Not defined" : value}
              </h1>
            </div>
          ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col  py-5 space-y-2 lg:mx-6 lg:my-5 mx-3 my-3   rounded-2xl bg-primary-color px-6 ">
      <div className="flex justify-between items-center">
        {renderRating(Number(testimonial.rating))}
        <button
          onClick={() => toggleLiked(testimonial._id)}
          className="focus:outline-none"
        >
          {isLiked ? (
            <FaHeart className="text-[#697565] cursor-pointer w-8 h-8" />
          ) : (
            <CiHeart className="text-gray-400 cursor-pointer w-8 h-8" />
          )}
        </button>
      </div>

      {renderContent()}

      <div className="flex flex-col md:flex-row justify-between">
        <div className="flex flex-col space-y-2">
          <span className="font-semibold text-lg">Name</span>
          <div className="flex space-x-2 items-center">
            {testimonial.photo && (
              <img
                src={testimonial.photo}
                alt="not found"
                className="rounded-full w-6 h-6 object-cover"
              />
            )}
            <h1 className="text-sm">{testimonial.name}</h1>
          </div>
          {testimonial.email && (
            <div className="flex flex-col text-lg">
              <span className="font-semibold">Email</span>
              <h1 className="text-sm">{testimonial.email}</h1>
            </div>
          )}
        </div>

        {renderDetails()}
      </div>

      <div className="flex space-x-2">
        <button
          className="flex justify-center items-center text-white px-3 py-1 rounded-md space-x-2"
          onClick={() =>
            testimonial.type === "video"
              ? setVideoUpdateModal(true)
              : setOpenUpdateModal(true)
          }
        >
          <FaPen />
          <span>Edit</span>
        </button>
        <button
          className="flex justify-center items-center px-3 py-1 rounded-md space-x-2"
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

      {openVideoUpdateModal && (
        <div className="flex justify-center items-center">
          <UpdateVideoModal
            onClose={() => setVideoUpdateModal(false)}
            testimonialId={testimonial._id}
          />
        </div>
      )}
    </div>
  );
};

export default Testimonial;
