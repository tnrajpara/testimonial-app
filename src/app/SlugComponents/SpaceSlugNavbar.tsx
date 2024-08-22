import React from "react";
import { FaPen } from "react-icons/fa6";
import Link from "next/link";

interface SpaceSlugNavbarProps {
  spaceImg: string;
  spaceTitle: string;
  spaceId: string;
}

const SpaceSlugNavbar: React.FC<SpaceSlugNavbarProps> = ({
  spaceImg,
  spaceTitle,
  spaceId,
}) => {
  return (
    <>
      <div className="flex justify-between space-x-3 text-gray-100 lg:ml-3 lg:mr-3 lg:py-4 py-2 ">
        <div className="flex items-center space-x-2 ">
          <img src={spaceImg} className="w-14 h-14 rounded-md object-cover" />
          <div>
            <h1 className="text-lg font-semibold">
              {spaceTitle.split("_").join(" ")}
            </h1>
          </div>
        </div>
        <Link
          className="flex place-content-center justify-center items-center bg-white text-gray-950 px-3 py-[1rem] rounded-md "
          href={`/editspace/${spaceId}`}
        >
          <FaPen
            size={15}
            className="
            text-gray-900 lg:mr-2"
          />
          Edit Space
        </Link>
      </div>
      <div className="my-4 w-full h-[0.2px] bg-gray-700"></div>
    </>
  );
};

export default SpaceSlugNavbar;
