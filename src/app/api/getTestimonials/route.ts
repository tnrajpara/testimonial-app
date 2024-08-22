import dbConnect from "../../utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id")?.toString();

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  console.log(req.nextUrl.searchParams);

  const { db } = await dbConnect();
  try {
    const spaceData = await db
      .collection("testimonial-data")
      .find({ spaceId: id })
      .toArray();

    if (spaceData.length === 0) {
      return NextResponse.json({ error: "Space not found" }, { status: 404 });
    }

    return NextResponse.json({ data: spaceData });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
