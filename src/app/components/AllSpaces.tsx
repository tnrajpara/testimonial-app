"use client";

import React from "react";
import axios from "axios";
import slugify from "slugify";
import Link from "next/link";

interface Space {
  id: string;
  spaceId: string;
  spacename: string;
  image: string;
}
interface AllSpacesProps {
  userId: string;
}

const AllSpaces: React.FC<AllSpacesProps> = ({ userId }) => {
  const [data, setData] = React.useState<Space[]>([] || null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/getAllRecords?userid=${userId}`);
        setData(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user spaces:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  // const createQueryString = useCallback(
  //   (name: any, value: any) => {
  //     const params = new URLSearchParams(searchParams);
  //     params.set(name, value);
  //     return params.toString();
  //   },
  //   [searchParams]
  // );

  return (
    <div className="my-8 mt-5 lg:mt-[3rem] max-w-[120rem] text-center text-gray-100 mx-4 ml-6">
      <div>
        <h1 className="text-left text-4xl font-bold">My Spaces</h1>
        {loading && (
          <div className="flex justify-start items-start h-40">
            <div className=" rounded-full h-20 w-20 ">
              <img src="/loading.gif" />
            </div>
          </div>
        )}
        {data.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:mt-10 mt-5">
            {data.map((item: any, key: any) => (
              <>
                <Link
                  href={`/space/${slugify(item.spacename, {
                    lower: true,
                  })}?id=${item.spaceId}`}
                  key={key}
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt=""
                      width={80}
                      height={80}
                      className="object-cover rounded-md"
                    />
                    <p className="text-gray-100 text-2xl font-semibold">
                      {item.spacename.split("_").join(" ")}
                    </p>
                  </div>
                </Link>
              </>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllSpaces;
