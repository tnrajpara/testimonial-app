"use client";

import React from "react";
import { usePathname } from "next/navigation";
import UpdateSpace from "../UpdateSpace";

const Page = () => {
  const pathName = usePathname();
  const id = pathName.split("/").pop();

  return <UpdateSpace id={id} />;
};

export default Page;
