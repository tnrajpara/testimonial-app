import dbConnect from "../../utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userid")?.toString();

  if (!userId) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const { db } = await dbConnect();

  try {
    const response = await db
      .collection("spaces-db")
      .find({ userId: userId })
      .toArray();

    if (response.length === 0) {
      return NextResponse.json({ error: "Space not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "success", data: response });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
