import React from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { usePathname } from "next/navigation";
import axios from "axios";
import { FaPen } from "react-icons/fa";
import ParentModal from "./ParentModal";
import { IoMdVideocam } from "react-icons/io";
import VideoModal from "./VideoModal";

const SpaceComponent = () => {
  const { user } = useUser();
  const sub = user?.sub?.split("|")[1];
  const [testimonialData, setTestimonialData] = React.useState([] as any);
  const [loading, setLoading] = React.useState(true); // Add loading state
  const [showModal, setShowModal] = React.useState(false);
  const [showVideoModal, setShowVideoModal] = React.useState(false);

  const pathName = usePathname().split("/").pop();
  const parts = pathName?.split("-");

  const id = parts?.slice(0, 5).join("-");

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true before fetching data
      try {
        const response = await axios.get(`/api/getSpace/${id}`);
        console.log(response.data.data);
        setTestimonialData(response.data.data);
      } catch (error) {
        console.error("Error fetching testimonial data:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  return (
    <div className="flex justify-center flex-col text-gray-50 items-center mx-auto min-h-[100vh] bg-[linear-gradient(to_right,#1E293B_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:24px_24px]">
      <div
        className={
          testimonialData.theme === true
            ? " lg:w-1/2 w-full h-full  flex bg-[#0b0b0b] text-gray-50 mt-5 justify-center flex-col items-center px-3 py-4 rounded-md border border-black"
            : "lg:w-1/2  w-full h-full  flex isolate aspect-video bg-white/80 text-gray-900 mt-5 justify-center flex-col items-center px-3 py-4 rounded-md"
        }
      >
        <img
          src={testimonialData.image}
          className="w-32 h-32 rounded-xl object-cover mb-2"
          alt="profile"
        />
        {loading ? (
          <div>Loading testimonials...</div> // Show loading state
        ) : (
          <div className="flex flex-col justify-center items-center">
            <h1
              className={
                testimonialData.theme === true
                  ? "text-gray-300 text-2xl lg:text-4xl mt-10 mb-5 font-semibold"
                  : "text-gray-800 text-2xl lg:text-4xl mt-10 mb-5 font-semibold"
              }
            >
              {testimonialData.title.split("_").join(" ")}
            </h1>

            <span className="text-start  mb-4  text-lg ">
              {testimonialData.message}
            </span>

            <ul className=" mb-2  rounded-md mt-2 ">
              {testimonialData.questions.map((question: any, index: any) => (
                <li key={index} className="mb-2 text-gray-300 list-disc">
                  {question}
                </li>
              ))}
            </ul>
            <div className="flex space-x-5">
              <div
                className="bg-violet-900"
                style={{
                  padding: "10px",
                  borderRadius: "4px",
                  display: "flex",
                  gap: "15px",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: testimonialData.buttonColor,
                  width: "calc(100% - 20px)",
                }}
              >
                <FaPen />
                <button
                  onClick={() => {
                    setShowModal(true);
                    console.log("clicked", showModal);
                  }}
                >
                  Send in Text{" "}
                </button>
              </div>
              <div
                style={{
                  padding: "10px",
                  borderRadius: "4px",
                  display: "flex",
                  gap: "15px",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "calc(100% - 20px)",
                }}
                onClick={() => {
                  setShowVideoModal(true);
                }}
              >
                <IoMdVideocam className="text-xl" />

                <button>Record a Video</button>
              </div>
            </div>
          </div>
        )}

        {showModal && (
          <ParentModal
            onClose={() => setShowModal(false)}
            parentImage={testimonialData.image}
            questions={testimonialData.questions}
            extraQuestions={testimonialData.extraInformation}
            spaceId={id ?? ""}
            spaceImage={testimonialData.image}
            spaceTitle={testimonialData.title}
          />
        )}

        {showVideoModal && (
          <VideoModal
            onClose={() => setShowVideoModal(false)}
            extraQuestions={testimonialData.extraInformation}
            spaceId={id ?? ""}
          />
        )}
      </div>
    </div>
  );
};

export default SpaceComponent;
