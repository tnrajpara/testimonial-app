// app/components/AllSpaces.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import slugify from "slugify";
import axios from "axios";

interface Space {
  id: string;
  spaceId: string;
  spacename: string;
  image: string;
}

export default function AllSpaces({ userId }: any) {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/getSpaces?userid=${userId}`);
        setSpaces(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user spaces:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  if (loading) {
    return <div>Loading spaces...</div>;
  }

  return (
    <div className="my-8 mt-5 lg:mt-[3rem] max-w-[120rem] text-center text-gray-100 mx-4 ml-6">
      <div>
        <h1 className="text-left text-4xl font-bold">My Spaces</h1>
        {spaces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:mt-10 mt-5">
            {spaces.map((item) => (
              <Link
                href={`/space/${slugify(item.spacename, {
                  lower: true,
                })}?id=${item.spaceId}`}
                key={item.id}
              >
                <div className="flex items-center space-x-4 bg-primary-color px-2 py-5  justify-around rounded-lg">
                  <img
                    src={item.image}
                    alt=""
                    className="object-cover w-20 h-20 rounded-md"
                  />
                  <p className=" text-2xl font-semibold text-[#f4f4f4]">
                    {item.spacename.split("_").join(" ")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p>You don&apos;t have any spaces yet.</p>
        )}
      </div>
    </div>
  );
}
