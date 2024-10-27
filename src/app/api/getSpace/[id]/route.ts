import dbConnect from "../../../../utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  let path = req.nextUrl.pathname;

  // const pathName = path.split("/").pop();
  // const parts = pathName?.split("-");

  // const id = parts?.slice(0, 5).join("-");

  const parts = path.split("/"); // Split the string by '/'
  const lastPart = parts.pop(); // Get the last part of the string
  const spaceId = lastPart?.split("-").slice(0, 5).join("-"); // Join the first 5 segments with '-'

  const { db } = await dbConnect();
  try {
    const spaceData = await db
      .collection("spaces-db")
      .findOne({ spaceId: spaceId });

    if (!spaceData) {
      return NextResponse.json({ error: "Space not found" }, { status: 404 });
    }

    return NextResponse.json({ data: spaceData });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
