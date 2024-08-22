import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../utils/dbConnect";

export async function POST(req: NextRequest) {
  const { db } = await dbConnect();
  try {
    const body = await req.json();
    const { spaceId, imageUrl } = body;
    const data = {
      id: spaceId,
      image: imageUrl,
    };
    const existingData = await db
      .collection("spaces-db")
      .findOne({ spaceId: spaceId });
    if (!existingData) {
      const response = await db.collection("spaces-db").insertOne(data);
      return NextResponse.json({ message: "success", data: response });
    } else {
      const response = await db
        .collection("spaces-db")
        .replaceOne({ spaceId: spaceId }, data, { upsert: true });
      return NextResponse.json({ message: "success", data: response });
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
