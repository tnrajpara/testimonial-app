import { ObjectId } from "mongodb";
import dbConnect from "../../../utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split("/").pop();
    const { db } = await dbConnect();

    const result = await db
      .collection("testimonial-data")
      .deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ message: "success", data: result });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "An error occurred", details: error },
      { status: 500 }
    );
  }
}
