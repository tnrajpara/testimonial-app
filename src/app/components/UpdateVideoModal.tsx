import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { FaStar } from "react-icons/fa";
import axios from "axios";

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
  const [extraQuestionValues, setExtraQuestionValues] = useState<Record<string, string>>({});
  const [uploadStatus, setUploadStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchTestimonial = async () => {
      try {
        setIsFetching(true);
        const response = await axios.get(`/api/getTestimonial/${testimonialId}`);
        const testimonialData = response.data.data;
        setName(testimonialData.name);
        setRating(testimonialData.rating);
        setExtraQuestionValues(testimonialData.extraQuestions || {});
        setVideoLink(testimonialData.link);
      } catch (error) {
        console.error("Error fetching testimonial:", error);
        setUploadStatus("Error loading testimonial data. Please try again.");
      } finally {
        setIsFetching(false);
      }
    };

    if (testimonialId) {
      fetchTestimonial();
    }
  }, [testimonialId]);

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

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

    setIsLoading(true);
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
        setTimeout(() => onClose(), 1500);
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      console.error("Error updating video testimonial:", error);
      setUploadStatus(
        "Error updating video testimonial. Please check your connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-xl mx-4 bg-gray-800 rounded-xl shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-xl font-semibold text-white">
            Update Video Testimonial
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        <div className="p-4">
          {isFetching ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-20"  >
              </div>
            </div>
          ) : (
            <form onSubmit={updateVideo} className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-gray-200">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-gray-200">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      size={24}
                      className="cursor-pointer transition-colors"
                      color={star <= rating ? "#00FFFF" : "#4B5563"}
                      onClick={() => handleRatingChange(star)}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-gray-200">Video Link (Vimeo)</label>
                <input
                  type="text"
                  value={videoLink}
                  onChange={(e) => setVideoLink(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              {Object.entries(extraQuestionValues).map(([key, value]) => (
                <div key={key} className="flex flex-col gap-2">
                  <label className="text-gray-200">{key}</label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleExtraQuestionChange(key, e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              ))}

              <div className="flex gap-2 justify-end pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
                >
                  {isLoading && <div className="animate-spin h-12 rounded-full" ></div>}
                  Update
                </button>
              </div>
            </form>
          )}

          {uploadStatus && (
            <div className={`mt-4 p-3 rounded-lg text-center ${uploadStatus.includes('successfully') ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
              }`}>
              {uploadStatus}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateVideoModal;
