import React from "react";
import SpaceSlugMenubar from "./SpaceSlugMenubar";
import SpaceSlugComponent from "./SpaceSlugComponent";

interface SpaceSlugParentProps {
  spaceId: string;
  spaceTitle: string;
  spaceImg: string;
}

const SpaceSlugParent: React.FC<SpaceSlugParentProps> = ({
  spaceId,
  spaceImg,
  spaceTitle,
}) => {
  return (
    <div className="flex flex-end justify-center text-gray-100 flex-col  md:items-center md:my-7 my-4">
      <SpaceSlugMenubar slugId={spaceId} spaceTitle={spaceTitle} />
      <SpaceSlugComponent spaceImg={spaceImg} spaceId={spaceId} />
    </div>
  );
};

export default SpaceSlugParent;
