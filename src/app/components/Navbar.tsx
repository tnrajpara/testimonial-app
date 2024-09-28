"use client";
import React from "react";
import { VscPreview } from "react-icons/vsc";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";

const Navbar = () => {
  const { user, error, isLoading } = useUser();
  const [dropDown, setShowDropDown] = React.useState(false);
  const pathname = usePathname();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <nav
      className={`flex justify-around items-center lg:justify-between  mt-7 lg:mt-6 w-full `}
    >
      <div className="flex space-x-2 justify-center items-center ml-5">
        {" "}
        {/* <VscPreview className="text-blue-300 text-2xl lg:text-3xl" /> */}
        <h1 className="text-gray-100 text-2xl lg:text-3xl font-bold">
          Testimonial{" "}
        </h1>
      </div>
      {user ? (
        <div className="relative mr-5">
          <img
            src={user.picture as string}
            alt=""
            className="w-12 h-12 rounded-md cursor-pointer"
            onClick={() => setShowDropDown(!dropDown)}
          />
          {dropDown && (
            <ul className="absolute top-16 left-0 bg-gray-800 p-3 rounded-md space-y-7">
              <li>
                <h1 className="text-white">Dashboard</h1>
              </li>
              <li>
                <Link href="/api/auth/logout" className="text-white">
                  Logout
                </Link>
              </li>
            </ul>
          )}
        </div>
      ) : (
        <Link
          href="/api/auth/login"
          className="bg-blue-600 text-white px-3 py-1 rounded-md"
        >
          Login
        </Link>
      )}
    </nav>
  );
};

export default Navbar;
