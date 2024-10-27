import React from "react";
import Link from "next/link";
import AllSpaces from "./components/AllSpaces";
import { useUser } from "@auth0/nextjs-auth0/client";

const Dashboard = () => {
  const { user } = useUser();
  const userId = user?.sub?.split("|")[1];
  return (
    <div className="">
      <div className="w-3/4 mx-auto  flex items-center flex-col justify-center max-w-[100rem] min-h-[85vh] text-center">
        <h1 className="text-3xl lg:text-6xl text-gray-100 font-bold">
          Welcome to the Testimonial App
        </h1>

        <p className="text-gray-300 mt-3 lg:mt-5 w-3/4 leading-9">
          Our platform makes it easy to collect, manage, and display
          testimonials, helping you connect with your audience and showcase the
          value of your products and services
        </p>

        <Link
          href="/create"
          className=" bg-[#f4f4f4] border-2 border-[#0b0b0b] text-[#0b0b0b] px-5 py-2 rounded-full mt-5 font-semibold hover:transition-all hover:delay-100 "
        >
          Create your own Wall of love
        </Link>
      </div>

      <div>
        <AllSpaces userId={userId ?? ""} />
      </div>
    </div>
  );
};

export default Dashboard;
