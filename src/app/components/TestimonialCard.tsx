'use client'
import VideoPlayer from './VideoPlayer';
import { useState } from 'react'

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
        className={`w-4 h-4 ${index < rating ? "text-yellow-400" : "text-gray-300"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const TestimonialCard: React.FC<Testimonial & { theme?: string }> = ({
  name,
  message,
  rating,
  photo,
  attachments,
  type,
  link,
  uploadedAt,
  theme = 'light'
}) => {
  const isDark = theme === 'dark';
  const [isExpanded, setIsExpanded] = useState<boolean>(false)

  return (
    <div className={`w-full h-full rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
      <div className="p-6 space-y-4 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start space-x-4">
          <div className="relative flex-shrink-0">


          </div>
          <div className={'flex-1 min-w-0 flex justify-between'}>
            <div className={`font-semibold truncate first-letter:capitalize ${isDark ? 'text-white' : 'text-gray-900'} flex space-x-1  items-center`}>
              {type === "text" && <img src={photo} className='w-7 h-7 rounded-full object-cover' />}
              <h1 className='first-letter:uppercase'>{name}</h1>
            </div>
            <StarRating rating={rating} />
            {/* {uploadedAt && (
              <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {new Date(uploadedAt).toLocaleDateString()}
              </p>
            )} */}
          </div>
        </div>

        {/* Content */}
        {message && (
          <div className="relative flex-grow">
            <svg
              className={`absolute left-0 top-0 h-6 w-6 transform -translate-x-2 -translate-y-2 ${isDark ? 'text-gray-700' : 'text-gray-200'}`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
            </svg>
            <p className={`pl-8 text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
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


        {type === "video" && (
          <div className="relative rounded-lg overflow-hidden mt-4">
            <VideoPlayer
              publicId={link?.split('upload/')[1]?.split('.')[0]} // Extracts the public ID from the Cloudinary URL
              cloudName="dihjks0ut" // Replace with your cloud name
              isExpanded={isExpanded}
              onToggleExpand={() => setIsExpanded(!isExpanded)}
            />
          </div>
        )}   </div>
    </div>
  );
};

export default TestimonialCard;
