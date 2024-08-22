import dbConnect from "../../utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { db } = await dbConnect();

    const body = await req.json();
    const { data } = body;
    const result = await db.collection("spaces-db").insertOne(data);

    return NextResponse.json({ message: "success", data: result });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "An error occurred", details: error },
      { status: 500 }
    );
  }
}
