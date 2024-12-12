import React from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { usePathname } from "next/navigation";
import axios from "axios";
import { FaPen } from "react-icons/fa";
import ParentModal from "../components/ParentModal";
import { IoMdVideocam } from "react-icons/io";
import VideoModal from "../components/VideoModal";

const TestimonialComponent = () => {
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
      setLoading(true);
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
    <div>
      {loading ? (
        <div className="animate-pulse space-y-4 flex justify-center items-center min-h-screen">
          <div className="flex justify-center ">
            <div className="md:h-[436px] md:w-[769.6px] w-[5rem] h-[5rem] bg-zinc-700 rounded-xl"></div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center flex-col text-gray-50 items-center mx-auto min-h-[100vh] bg-[linear-gradient(to_right,#151515_1px,transparent_1px),linear-gradient(to_bottom,#151515_1px,transparent_1px)] bg-[size:24px_24px]">
          <div
            className={
              testimonialData.theme === true
                ? " lg:w-1/2 w-full h-full  flex bg-primary-color  text-gray-50  mt-5 justify-center flex-col items-center px-3 py-4 md:py-10 rounded-3xl "
                : "lg:w-1/2  w-full h-full  flex bg-gray-50 text-primary-color  mt-5 justify-center flex-col items-center px-3 py-4 md:py-10 rounded-3xl"
            }
          >
            {testimonialData.image && (
              <img
                src={testimonialData.image}
                className="w-32 h-32 rounded-xl object-cover mb-2"
                alt="profile"
              />
            )}
            {loading ? (
              <div className="md:w-1/2 md:h-1/2 animate-ping bg-primary-color"></div>
            ) : (
              <div className="flex flex-col justify-center items-center">
                <h1
                  className={
                    testimonialData.theme === true
                      ? "text-gray-300 text-2xl lg:text-4xl mt-10 mb-5 font-semibold"
                      : "text-primary-color text-2xl lg:text-4xl mt-10 mb-5 font-semibold"
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
                <div className="flex  mt-7 justify-between w-3/4">
                  <div
                    style={{
                      padding: "10px",
                      borderRadius: "10%",
                      display: "flex",
                      gap: "15px",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: testimonialData.buttonColor,
                    }}
                  >
                    <FaPen />
                    <button
                      onClick={() => {
                        setShowModal(true);
                        console.log("clicked", showModal);
                      }}
                      className="text-md"
                    >
                      Send in Text{" "}
                    </button>
                  </div>
                  <div
                    style={{
                      borderRadius: "4px",
                      display: "flex",
                      gap: "15px",
                      justifyContent: "center",
                      alignItems: "center",

                    }}
                    onClick={() => {
                      setShowVideoModal(true);
                    }}
                  >
                    <IoMdVideocam className="" />
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
      )}
    </div>
  )
};

export default TestimonialComponent;
