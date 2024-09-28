import React, { useState, useRef, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { FaStar } from "react-icons/fa";
import axios from "axios";

interface ExtraQuestionValue {
  [key: string]: string;
}

interface UpdateVideoModalProps {
  onClose: () => void;
  testimonialId: string;
}

const UpdateVideoModal: React.FC<UpdateVideoModalProps> = ({
  onClose,
  testimonialId,
}) => {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [videoLink, setVideoLink] = useState("");
  const [extraQuestionValues, setExtraQuestionValues] = useState<
    Record<string, string>
  >({});
  const [uploadStatus, setUploadStatus] = useState("");

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  useEffect(() => {
    const fetchTestimonial = async () => {
      try {
        const response = await axios.get(
          `/api/getTestimonial/${testimonialId}`
        );
        const testimonialData = response.data.data;
        setName(testimonialData.name);
        setRating(testimonialData.rating);
        setExtraQuestionValues(testimonialData.extraQuestions || {});
        setVideoLink(testimonialData.link);
      } catch (error) {
        console.error("Error fetching testimonial:", error);
      }
    };
    if (testimonialId) {
      fetchTestimonial();
    }
  }, [testimonialId]);

  const handleExtraQuestionChange = (key: string, value: string) => {
    setExtraQuestionValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateVideo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !videoLink.trim()) {
      setUploadStatus("Please fill in all required fields.");
      return;
    }

    const updatedData = {
      name,
      rating,
      link: videoLink,
      extraQuestionValues,
    };

    try {
      const response = await axios.put(`/api/updateTestimonial`, {
        id: testimonialId,
        data: updatedData,
      });

      if (response.status === 200) {
        setUploadStatus("Video testimonial updated successfully");
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      console.error("Error updating video testimonial:", error);
      setUploadStatus(
        "Error updating video testimonial. Please check your connection and try again."
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-[#141414] rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Update Video Testimonial
          </h3>
          <button
            className="text-gray-400 hover:text-gray-500 dark:text-gray-200 dark:hover:text-gray-100"
            onClick={onClose}
          >
            <IoMdClose size={24} />
          </button>
        </div>

        <form onSubmit={updateVideo} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Rating
            </label>
            <div className="flex items-center mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  size={24}
                  color={star <= rating ? "#FFA500" : "#D1D5DB"}
                  onClick={() => handleRatingChange(star)}
                  className="cursor-pointer"
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Video Link (Vimeo)
            </label>
            <input
              type="text"
              value={videoLink}
              onChange={(e) => setVideoLink(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          {Object.entries(extraQuestionValues).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {key}
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => handleExtraQuestionChange(key, e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          ))}

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Update
            </button>
          </div>
        </form>

        {uploadStatus && (
          <p className="mt-4 text-center text-sm font-medium text-gray-700 dark:text-gray-300">
            {uploadStatus}
          </p>
        )}
      </div>
    </div>
  );
};

export default UpdateVideoModal;
