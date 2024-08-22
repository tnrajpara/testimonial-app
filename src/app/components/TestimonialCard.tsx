import React from "react";
import { FaStar } from "react-icons/fa";

type Testimonial = {
  name: string;
  message: string;
  rating: number;
  photo: string;
  attachments?: string[];
};

const TestimonialCard: React.FC<Testimonial> = ({
  name,
  message,
  rating,
  photo,
  attachments,
}) => {
  return (
    <div className="bg-gray-900 text-gray-50 shadow-lg rounded-lg p-4 md:p-6 max-w-[calc(100vw-2rem)] mx-auto lg:space-y-4 space-y-2 ">
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 lg:flex-row">
        <img
          src={photo}
          alt={name}
          className="w-16 h-16 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0 "
        />
        <div className="flex-grow">
          <h2 className="text-lg font-semibold">{name}</h2>
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, index) => (
              <FaStar
                key={index}
                className={`w-[calc(2vw+6px)] h-[calc(2vw+6px)] max-w-[20px] max-h-[20px] ${
                  index < rating ? "text-yellow-500" : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      <p className="mt-4 text-gray-100 text-sm md:text-base lg:text-lg">
        {message}
      </p>
      {attachments && attachments.length > 0 && (
        <div className="mt-4 relative w-1/2 h-1/2 max-w-md  ">
          <div className="relative pb-[56.25%] lg:pb-[75%]">
            <img
              src={attachments[0]}
              alt=""
              className="absolute inset-0 w-full h-full object-cover rounded-lg rounded-md"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialCard;
