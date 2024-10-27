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
      <div className="flex space-x-3 text-gray-100 lg:px-3 px-3 md:mr-3 md:py-4 py-2 md:w-full md:justify-between mx-auto">
        <div className="flex items-center space-x-2 ">
          <img src={spaceImg} className="w-14 h-14 rounded-md object-cover" />
          <div>
            <h1 className="text-lg font-semibold">
              {spaceTitle.split("_").join(" ")}
            </h1>
          </div>
        </div>
        <Link
          className="flex place-content-center space-x-4  bg-blue-600 text-text-primary my-auto font-semibold  px-5 py-2  justify-center items-center rounded-full "
          href={`/editspace/${spaceId}`}
        >
          <FaPen
            size={15}
            className="
            text-blue-100 lg:mr-2"
          />
          <p>Edit</p>
        </Link>
      </div>
      {/* <div className="my-4 w-full h-[0.2px] justify-center text-center  bg-gray-700"></div> */}
    </>
  );
};

export default SpaceSlugNavbar;
