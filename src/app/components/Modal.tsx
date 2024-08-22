import React, { useState, ChangeEvent } from "react";
import { IoMdClose } from "react-icons/io";
import { FaStar } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import axios from "axios";

interface ModalProps {
  onClose: () => void;
  parentImage: string;
  questions: string[];
  extraQuestions: ExtraQuestion[];
  onThanks: () => void;
  spaceId: string | "";
  spaceImage: string;
  spaceTitle: string;
}

interface ExtraQuestion {
  text: string;
  value: boolean;
  required: boolean;
}

const Modal: React.FC<ModalProps> = ({
  onClose,
  parentImage,
  questions,
  extraQuestions,
  onThanks,
  spaceId,
  spaceImage,
  spaceTitle,
}) => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(0);
  const [extraQuestionValues, setExtraQuestionValues] = useState<
    Record<string, string>
  >({});
  const [singlePhotoURL, setSinglePhotoURL] = useState<string | null>(null);
  const [multipleFiles, setMultipleFiles] = useState<{ url: string }[]>([]);
  const [singlePhoto, setSinglePhoto] = useState<File | null>(null);
  const [multiplePhotos, setMultiplePhotos] = useState<File[]>([]);

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleExtraQuestionChange = (
    question: ExtraQuestion,
    value: string
  ) => {
    setExtraQuestionValues({
      ...extraQuestionValues,
      [question.text]: value,
    });
  };

  React.useEffect(() => {
    return () => {
      if (singlePhotoURL) URL.revokeObjectURL(singlePhotoURL);
      multipleFiles.forEach((file) => URL.revokeObjectURL(file.url));
    };
  }, [singlePhotoURL, multipleFiles]);

  const handleSinglePhotoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log(file);
    if (file) {
      if (singlePhotoURL) URL.revokeObjectURL(singlePhotoURL);
      setSinglePhotoURL(URL.createObjectURL(file));
      setSinglePhoto(file);
    }
    console.log(file);
  };

  const handleMultipleFilesUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setMultiplePhotos(newFiles);
      setMultipleFiles(
        newFiles.map((file) => ({
          url: URL.createObjectURL(file),
        }))
      );
    }
  };

  const isImageFile = (type: string) => {
    return type.startsWith("image/");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(singlePhotoURL);
    if (singlePhotoURL) {
      try {
        const formData = new FormData();
        formData.append("key", "fdb268936bd52b917f9f5eebaa5adde6");
        formData.append("image", singlePhoto as any);

        const response1 = await axios.post(
          "https://api.imgbb.com/1/upload",
          formData
        );

        let imageUrl = response1.data.data.display_url;

        console.log(imageUrl);

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

        console.log("multiplePhotos", images);

        const data = {
          name: name,
          email: email,
          rating: rating,
          message: message,
          photo: imageUrl,
          attachments: images,
          spaceId: spaceId,
          spaceImage: spaceImage,
          spaceTitle: spaceTitle,
          extraQuestions: extraQuestionValues,
        };
        const formResponse = await axios.post("/api/postTestimonialData", {
          data: data,
        });
        console.log("response", formResponse);

        onThanks();
      } catch (err) {
        console.error(err);
      }
    }

    // onClose();
  };

  return (
    <>
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

              <form onSubmit={handleSubmit}>
                <div className="flex justify-center">
                  <img
                    src={parentImage}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover mb-4 mt-4"
                  />
                </div>
                <div className="lg:mb-10 mb-5">
                  <h1
                    className={
                      "text-gray-300 text-start lg:mr-52 mb-2 mr-20 font-semibold"
                    }
                  >
                    QUESTIONS
                  </h1>
                  <div className={"border-b-4 border-gray-50 w-1/2"}></div>
                  <ul className=" mb-2  rounded-md mt-2 ">
                    {questions.map((question, index) => (
                      <li key={index} className="mb-2 text-gray-300">
                        {question}
                      </li>
                    ))}
                  </ul>
                </div>
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

                <div className="mb-4">
                  {/* <label
                  htmlFor="message"
                  className="block text-gray-100 font-bold mb-2"
                >
                  Message
                </label> */}
                  <textarea
                    id="message"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-100 bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="photo"
                    className="block text-gray-100 font-bold mb-2"
                  >
                    Attach Image(s)
                  </label>
                  <ul className="flex mb-2">
                    {multipleFiles.map((file, index) => (
                      <div key={index} className="relative">
                        <>
                          <img
                            src={file.url}
                            alt={`Uploaded file ${index + 1}`}
                            className="w-20 h-20 rounded-md object-cover mr-4"
                          />
                          <button>
                            <RiDeleteBin5Line
                              size={14}
                              className="absolute right-0 top-0"
                              onClick={() => {
                                const newFiles = multipleFiles.filter(
                                  (_, i) => i !== index
                                );
                                URL.revokeObjectURL(file.url);
                                setMultipleFiles(newFiles);
                              }}
                            />
                          </button>
                        </>
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

                {extraQuestions.map((question, index) => (
                  <div key={index} className="mb-4">
                    <label
                      htmlFor={`extra-question-${index}`}
                      className="block text-gray-100 font-bold mb-2"
                    >
                      {question.text}
                    </label>
                    {question.value ? (
                      <input
                        type="text"
                        id={`extra-question-${index}`}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-100 bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder={question.text}
                        value={extraQuestionValues[question.text] || ""}
                        onChange={(e) =>
                          handleExtraQuestionChange(question, e.target.value)
                        }
                        required={question.required}
                      />
                    ) : (
                      <textarea
                        id={`extra-question-${index}`}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-100 bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        rows={2}
                        placeholder={question.text}
                        value={extraQuestionValues[question.text] || ""}
                        onChange={(e) =>
                          handleExtraQuestionChange(question, e.target.value)
                        }
                        required={question.required}
                      ></textarea>
                    )}
                  </div>
                ))}

                <div className="mb-4">
                  <label
                    htmlFor="photo"
                    className="block text-gray-100 font-bold mb-2"
                  >
                    Upload your photo
                  </label>
                  <div className="flex items-center spacex-x-2">
                    {/* {singlePhotoObjectUrl ? (
                    <img
                      src={singlePhotoObjectUrl}
                      alt="Preview"
                      className="w-20 h-20 rounded-full object-cover mr-4"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-700 mr-4"></div>
                  )} */}
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
                    {singlePhotoURL ? (
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
                    ) : null}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-gray-700 hover:bg-gray-600 text-gray-100 font-bold py-2 px-4 rounded"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
