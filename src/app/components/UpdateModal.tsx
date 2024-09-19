import React, { useState, ChangeEvent, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { FaStar } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import axios from "axios";

interface UpdateModalProps {
  onClose: () => void;
  testimonialId: string;
  spaceImg: string;
  // onUpdate: (updatedTestimonial: any) => void;
}

interface ExtraQuestion {
  text: string;
  value: boolean;
  required: boolean;
}

const UpdateModal: React.FC<UpdateModalProps> = ({
  onClose,
  testimonialId,
  spaceImg,
}) => {
  const [data, setData] = useState<any>(null);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(0);
  const [singlePhotoURL, setSinglePhotoURL] = useState<string | null>(null);
  const [multipleFilesURL, setMultipleFilesURL] = useState<{ url: string }[]>(
    []
  );
  const [extraQuestions, setExtraQuestions] = useState<Record<string, string>>(
    {}
  );
  const [singlePhoto, setSinglePhoto] = useState<File | null>(null);
  const [multiplePhotos, setMultiplePhotos] = useState<File[]>([]);

  useEffect(() => {
    const fetchTestimonial = async () => {
      try {
        const response = await axios.get(
          `/api/getTestimonial/${testimonialId}`
        );
        const testimonialData = response.data.data;
        setData(testimonialData);
        setName(testimonialData.name);
        setMessage(testimonialData.message);
        setEmail(testimonialData.email);
        setRating(testimonialData.rating);
        setSinglePhotoURL(testimonialData.photo);
        setMultipleFilesURL(
          testimonialData.attachments.map((url: string) => ({
            url,
          }))
        );
        setExtraQuestions(testimonialData.extraQuestions || {});
      } catch (error) {
        console.error("Error fetching testimonial:", error);
      }
    };
    if (testimonialId) {
      fetchTestimonial();
    }
  }, [testimonialId]);

  React.useEffect(() => {
    return () => {
      if (singlePhotoURL) URL.revokeObjectURL(singlePhotoURL);
      multipleFilesURL.forEach((file) => URL.revokeObjectURL(file.url));
    };
  }, [singlePhotoURL, multipleFilesURL]);

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleSinglePhotoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (singlePhotoURL) URL.revokeObjectURL(singlePhotoURL);
      setSinglePhotoURL(URL.createObjectURL(file));
      setSinglePhoto(file);
    }
    console.log("single photo", singlePhoto);
  };

  const handleExtraQuestionChange = (question: string, value: string) => {
    setExtraQuestions((prevQuestions) => ({
      ...prevQuestions,
      [question]: value,
    }));
  };

  const handleMultipleFilesUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setMultiplePhotos(newFiles);
      setMultipleFilesURL(
        newFiles.map((file) => ({
          url: URL.createObjectURL(file),
        }))
      );
      console.log("multiple photos", multiplePhotos);
      console.log("multiple files url", multipleFilesURL);
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (singlePhoto && multiplePhotos.length === 0) {
        const formData = new FormData();
        formData.append("key", "fdb268936bd52b917f9f5eebaa5adde6");
        formData.append("image", singlePhoto as any);

        const response = await axios.post(
          "https://api.imgbb.com/1/upload",
          formData
        );

        let imageUrl = response.data.data.display_url;
        const updatedData = {
          name,
          email,
          rating,
          message,
          photo: imageUrl,
          attachments: multipleFilesURL.map((file) => file.url),
          extraQuestions,
        };
        const response1 = await axios.put(
          `/api/updateTestimonial/${data._id}`,
          {
            id: data._id,
            data: updatedData,
          }
        );

        console.log("response 1", response1);
        if (response.status === 200) {
          onClose(); // Close the modal after successful update
        }
      }

      if (singlePhoto && multiplePhotos.length > 0) {
        const formData = new FormData();
        formData.append("key", "fdb268936bd52b917f9f5eebaa5adde6");
        formData.append("image", singlePhoto as any);

        const response1 = await axios.post(
          "https://api.imgbb.com/1/upload",
          formData
        );

        let imageUrl = response1.data.data.display_url;

        let images = [];

        for (let image of multiplePhotos) {
          const formData = new FormData();
          formData.append("key", "fdb268936bd52b917f9f5eebaa5adde6");
          formData.append("image", image as any);

          const response2 = await axios.post(
            "https://api.imgbb.com/1/upload",
            formData
          );

          images.push(response2.data.data.display_url);
        }

        const updatedData = {
          name,
          email,
          rating,
          message,
          photo: imageUrl,
          attachments: images,
          extraQuestions,
        };
        const response2 = await axios.put(
          `/api/updateTestimonial/${data._id}`,
          {
            id: data._id,
            data: updatedData,
          }
        );
        console.log("response 2", response2);
        if (response2.status === 200) {
          onClose(); // Close the modal after successful update
        }
      }

      if (!singlePhoto && multiplePhotos.length > 0) {
        let images = [];

        for (let image of multiplePhotos) {
          const formData = new FormData();
          formData.append("key", "fdb268936bd52b917f9f5eebaa5adde6");
          formData.append("image", image as any);

          const response2 = await axios.post(
            "https://api.imgbb.com/1/upload",
            formData
          );

          images.push(response2.data.data.display_url);
        }

        const updatedData = {
          name,
          email,
          rating,
          message,
          photo: singlePhotoURL,
          attachments: images,
          extraQuestions,
        };
        const response3 = await axios.put(
          `/api/updateTestimonial/${data._id}`,
          {
            id: data._id,
            data: updatedData,
          }
        );
        console.log("response 3", response3);
        if (response3.status === 200) {
          onClose(); // Close the modal after successful update
        }
      }

      if (!singlePhoto && multiplePhotos.length === 0) {
        const updatedData = {
          name,
          email,
          rating,
          message,
          photo: singlePhotoURL,
          attachments: multipleFilesURL.map((file) => file.url),
          extraQuestions,
        };
        const response4 = await axios.put(
          `/api/updateTestimonial/${data._id}`,
          {
            id: data._id,
            data: updatedData,
          }
        );
        console.log("response 4", response4);
        if (response4.status === 200) {
          // onUpdate(updatedData);
          onClose(); // Close the modal after successful update
        }
      }
    } catch (error) {
      console.error("Error updating testimonial:", error);
    }
  };

  if (!data) return <div>Loading...</div>;

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <button
              className="absolute top-2 right-2 text-gray-100 hover:text-gray-300"
              onClick={onClose}
            >
              <IoMdClose size={24} />
            </button>

            <form onSubmit={handleUpdate}>
              <div className="flex justify-center">
                <img
                  src={spaceImg}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover mb-4 mt-4"
                />
              </div>

              {/* Rating */}
              <div className="mb-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      size={24}
                      color={star <= rating ? "#00FFFF" : "#D1D5DB"}
                      onClick={() => handleRatingChange(star)}
                    />
                  ))}
                </div>
              </div>

              {/* Message */}
              <div className="mb-4">
                <textarea
                  id="message"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-100 bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              </div>

              {/* Attachments */}
              <div className="mb-4">
                <label
                  htmlFor="photo"
                  className="block text-gray-100 font-bold mb-2"
                >
                  Attach Image(s)
                </label>
                <ul className="flex mb-2">
                  {multipleFilesURL.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={file.url}
                        alt={`Uploaded file ${index + 1}`}
                        className="w-44 h-44 rounded-md object-cover mr-4"
                      />
                      <button>
                        <RiDeleteBin5Line
                          size={14}
                          className="absolute right-0 top-0"
                          onClick={() => {
                            const newFiles = multipleFilesURL.filter(
                              (_, i) => i !== index
                            );
                            setMultipleFilesURL(newFiles);
                          }}
                        />
                      </button>
                    </div>
                  ))}
                </ul>
                <div className="flex items-center">
                  <label
                    htmlFor="photo-input"
                    className="bg-gray-700 hover:bg-gray-600 text-gray-100 font-bold py-2 px-4 rounded cursor-pointer"
                  >
                    Choose File
                  </label>
                  <input
                    type="file"
                    id="photo-input"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleMultipleFilesUpload}
                  />
                </div>
              </div>

              {/* Name */}
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-gray-100 font-bold mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-100 bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-gray-100 font-bold mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-100 bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {Object.entries(extraQuestions).map(
                ([question, value], index) => (
                  <div key={index} className="mb-4">
                    <label
                      htmlFor={`extra-question-${index}`}
                      className="block text-gray-100 font-bold mb-2"
                    >
                      {question}
                    </label>
                    <input
                      type="text"
                      id={`extra-question-${index}`}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-100 bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder={question}
                      value={value}
                      onChange={(e) =>
                        handleExtraQuestionChange(question, e.target.value)
                      }
                    />
                  </div>
                )
              )}

              {/* Profile Photo */}
              <div className="mb-4">
                <label
                  htmlFor="photo"
                  className="block text-gray-100 font-bold mb-2"
                >
                  Upload your photo
                </label>
                <div className="flex items-center spacex-x-2">
                  {singlePhotoURL ? (
                    <img
                      src={singlePhotoURL}
                      alt="Preview"
                      className="w-20 h-20 rounded-full object-cover mr-4"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-700 mr-4"></div>
                  )}
                  <label
                    htmlFor="single-photo-input"
                    className="bg-gray-700 hover:bg-gray-600 text-gray-100 font-bold py-2 px-4 rounded cursor-pointer"
                  >
                    Choose Image
                  </label>
                  <input
                    type="file"
                    id="single-photo-input"
                    className="hidden"
                    onChange={handleSinglePhotoUpload}
                  />
                  {singlePhotoURL && (
                    <button>
                      <RiDeleteBin5Line
                        size={24}
                        className="text-gray-100 hover:text-gray-300"
                        onClick={() => {
                          URL.revokeObjectURL(singlePhotoURL);
                          setSinglePhotoURL(null);
                        }}
                      />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-gray-700 hover:bg-gray-600 text-gray-100 font-bold py-2 px-4 rounded"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateModal;
