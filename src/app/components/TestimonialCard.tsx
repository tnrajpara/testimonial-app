"use client";

import { FaStar } from "react-icons/fa";
import VideoPlayer from "./VideoPlayer";

interface Testimonial {
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

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-1">
    {[...Array(5)].map((_, index) => (
      <svg
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "text-yellow-400" : "text-gray-300"
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const TestimonialCard: React.FC<Testimonial> = ({
  name,
  message,
  rating,
  photo,
  attachments,
  type,
  link,
  uploadedAt,
}) => {
  return (
    <div className=" rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-black">
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start space-x-4">
          <div className="relative flex-shrink-0">
            <img
              src={photo || "/vercel.svg"}
              alt={name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder-avatar.png";
              }}
            />
            {type === "video" && (
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                Video
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate first-letter:capitalize">
              {name}
            </h3>
            <StarRating rating={rating} />
            {uploadedAt && (
              <p className="text-sm text-gray-500 mt-1">
                {new Date(uploadedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {/* Content */}
        {message && (
          <div className="relative">
            <svg
              className="absolute left-0 top-0 h-6 w-6 text-gray-200 transform -translate-x-2 -translate-y-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
            </svg>
            <p className="pl-8 text-gray-600 text-sm leading-relaxed">
              {message}
            </p>
          </div>
        )}

        {/* Attachments */}
        {attachments && attachments.length > 0 && (
          <div className="relative mt-4 rounded-lg overflow-hidden group">
            <img
              src={attachments[0]}
              alt=""
              className="w-full h-48 object-cover transform transition-transform duration-300 group-hover:scale-105"
            />
            {attachments.length > 1 && (
              <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                +{attachments.length - 1} more
              </div>
            )}
          </div>
        )}

        {/* Video Player */}
        {type === "video" && (
          <div className="relative rounded-lg overflow-hidden mt-4">
            <VideoPlayer videoId={link?.split("/").pop()} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialCard;
