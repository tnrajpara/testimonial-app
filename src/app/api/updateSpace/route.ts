import dbConnect from "../../../utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const { db } = await dbConnect();

    const body = await req.json();
    const { id, data } = body;

    const result = await db
      .collection("spaces-db")
      .updateOne({ spaceId: id }, { $set: data });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Space not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "success", data: result });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "An error occurred", details: error },
      { status: 500 }
    );
  }
}
