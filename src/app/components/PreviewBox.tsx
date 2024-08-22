import { marked } from "marked";
import { FaPen } from "react-icons/fa";
import React from "react";
import { ImEarth } from "react-icons/im";
import { create } from "domain";

interface PreviewBoxProps {
  title: string;
  message: string;
  theme: boolean;
  ratings: boolean;
  questions: string[];
  image: string | undefined | Blob;
  initialImage: string | null;
  buttonColor: string;
}

const PreviewBox: React.FC<PreviewBoxProps> = ({
  title,
  message,
  theme,
  ratings,
  questions,
  image,
  initialImage,
  buttonColor,
}) => {
  const imageSrc = image instanceof Blob ? URL.createObjectURL(image) : image;

  return (
    <div
      className={
        theme === true
          ? " lg:w-11/12 w-full h-full  flex bg-[#1E201E] text-gray-50 mt-5 justify-center flex-col items-center px-3 py-4 rounded-md border border-black"
          : "lg:w-11/12 w-full h-full  flex isolate aspect-video bg-white/80 text-gray-900 mt-5 justify-center flex-col items-center px-3 py-4 rounded-md"
      }
    >
      {imageSrc && (
        <img
          src={imageSrc}
          alt="profile"
          className="rounded-md w-44 h-44 object-cover"
        />
      )}
      <h1 className="text-xl mt-3 mb-4 font-bold text-center">
        {title.split("_").join(" ")}
      </h1>
      <div className="flex flex-wrap overflow-y-auto ">
        {message ? (
          <div className="w-4/5 mx-auto mb-5 flex justify-center  ">
            {" "}
            <span className="text-start  leading-7  text-sm ">{message}</span>
          </div>
        ) : (
          <span className="mb-4 leading-7 text-gray-500">
            Your custom message goes here ...
          </span>
        )}
      </div>{" "}
      <div className="lg:mb-10 mb-5">
        <h1
          className={
            theme === true
              ? "text-gray-300 text-start lg:mr-52 mb-2 mr-20 font-semibold"
              : "text-gray-800 text-start lg:mr-52 mb-2 mr-20 font-semibold"
          }
        >
          QUESTIONS
        </h1>
        <div
          className={
            theme === true
              ? "border-b-4 border-gray-50 w-1/2"
              : "border-b-4 border-gray-900 w-1/2"
          }
        ></div>
        <ul className=" mb-2  rounded-md mt-2 ">
          {questions.map((question, index) => (
            <li
              key={index}
              className={
                theme === true ? "mb-2 text-gray-300" : "mb-2 text-gray-900"
              }
            >
              {question}
            </li>
          ))}
        </ul>
      </div>
      <div
        style={{
          backgroundColor: buttonColor,
          padding: "10px",
          borderRadius: "4px",
          display: "flex",
          gap: "15px",
          justifyContent: "center",
          alignItems: "center",
          width: "calc(100% - 20px)",
        }}
      >
        <FaPen />
        <button>Send in Text </button>
      </div>
    </div>
  );
};

export default PreviewBox;
