"use client";
import React, { useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import Dashboard from "./Dashboard";
import axios from "axios";
import Home from "./components/Home";

const Page = () => {
  const { user, error, isLoading } = useUser();
  let sub = user?.sub?.split("|")[1];
  if (isLoading)
    return (
      <div className="min-w-[100vh] min-h-[100vh] flex justify-center items-center">
        <div className="animate-ping rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-100"></div>
      </div>
    );
  if (error) return <div>{error.message}</div>;

  return <div>{user ? <Dashboard /> : <Home />}</div>;
};

export default Page;
