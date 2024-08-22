import dbConnect from "../../../utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  let path = req.nextUrl.pathname;

  const parts = path.split("/");
  const spaceId = parts.pop();

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