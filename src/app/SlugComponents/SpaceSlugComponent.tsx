import React from "react";
import { CiHeart } from "react-icons/ci";
import { FaHeart, FaStar } from "react-icons/fa";
import UpdateModal from "../components/UpdateModal";
import axios from "axios";
import { RiDeleteBinFill } from "react-icons/ri";
import { FaPen } from "react-icons/fa6";
import { useTestimonials } from "../contexts/TestimonialContext";

interface SpaceSlugComponentProps {
  spaceImg: string;
}

const SpaceSlugComponent: React.FC<SpaceSlugComponentProps> = ({
  spaceImg,
}) => {
  const { testimonials, updateTestimonial, fetchTestimonials } =
    useTestimonials();
  const [favorite, setFavorite] = React.useState(false);
  const [openUpdateModal, setOpenUpdateModal] = React.useState(false);

  const handleDelete = (id: string) => async () => {
    try {
      await axios.delete(`/api/deleteTestimonial/${id}`);
      // Refresh testimonials after deletion
      await fetchTestimonials();
    } catch (error) {
      console.error("Error deleting testimonial:", error);
    }
  };

  return (
    <div className="w-3/5  flex mx-5 min-w-screen flex-col space-y-5 ">
      {testimonials.map((testimonial: any) => {
        return (
          <>
            <div className="flex justify-between flex-col px-3 py-5 space-x-2 lg:mx-6 lg:my-5 mx-3 my-3 min-w-[40rem] bg-[#222222] rounded-md lg:spcae-y-6 space-y-2">
              <div className="flex justify-between ">
                <div className="flex items-center">
                  {[...Array(testimonial.rating)].map((_, index) => (
                    <FaStar key={index} className="text-yellow-400" />
                  ))}
                </div>
                {favorite ? (
                  <FaHeart
                    onClick={() => setFavorite(false)}
                    className="text-red-500 cursor-pointer text-3xl "
                  />
                ) : (
                  <CiHeart
                    onClick={() => setFavorite(true)}
                    className="text-gray-400 cursor-pointer text-3xl"
                  />
                )}
              </div>
              <div className="text-sm w-3/4"> {testimonial.message} </div>
              <div className="flex items-center lg:space-x-5 space-x-2">
                {testimonial.attachments.map((attachment: any, index: any) => (
                  <img
                    key={index}
                    src={attachment}
                    alt="attachments"
                    className="w-20 h-20 rounded-md object-cover"
                  />
                ))}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-col space-y-2">
                  <div className="flex flex-col space-y-2">
                    <span>Name</span>
                    <div className="flex space-x-2  items-center">
                      <img
                        src={testimonial.photo}
                        alt="not found"
                        className="rounded-full w-6 h-6 object-cover"
                      />
                      <h1 className="text-sm">{testimonial.name}</h1>
                    </div>
                  </div>
                  <div className="flex flex-col ">
                    <span>Email</span>
                    <h1 className="text-sm">{testimonial.email}</h1>
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  {testimonial.extraQuestions &&
                    Object.entries(testimonial.extraQuestions).map(
                      ([key, value], index) => (
                        <div key={index} className="flex flex-col">
                          <span>{key}</span>
                          <h1 className="text-sm">
                            {value === undefined || value === ""
                              ? "Not defined"
                              : (value as React.ReactNode)}
                          </h1>
                        </div>
                      )
                    )}
                </div>
              </div>
              <div className="space-x-2 flex ">
                <button
                  className=" space-x-2 flex justify-center items-center  text-white px-3 py-1 rounded-md "
                  onClick={() => setOpenUpdateModal(true)}
                >
                  <FaPen />
                  <span>Edit</span>
                </button>
                <button
                  className="flex space-x-2 justify-center items-center  px-3 py-1 rounded-md "
                  onClick={handleDelete(testimonial._id)}
                >
                  <RiDeleteBinFill />
                  <span> Delete</span>
                </button>
              </div>
              <div className="flex justify-center items-center">
                {openUpdateModal && (
                  <UpdateModal
                    onClose={() => setOpenUpdateModal(false)}
                    testimonialId={testimonial._id}
                    spaceImg={spaceImg}
                    onUpdate={updateTestimonial}
                  />
                )}
              </div>
            </div>
          </>
        );
      })}
    </div>
  );
};

export default SpaceSlugComponent;
