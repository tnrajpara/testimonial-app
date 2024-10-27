"use client";

import React from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import Dashboard from "../Dashboard";
import Home from "../components/Home";

const Page = () => {
  const { user, error, isLoading } = useUser();
  let sub = user?.sub?.split("|")[1];
  if (isLoading) return <h1>Loading...</h1>;
  if (error) return <div>{error.message}</div>;

  return <div>{user ? <Dashboard /> : <Home />}</div>;
};

export default Page;
