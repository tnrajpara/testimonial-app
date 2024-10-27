import dbConnect from "../../../../utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();

  const { db, client } = await dbConnect();
  try {
    console.log("path is ", id);

    const response = await db.collection("spaces-db").findOne({ id: id });
    return NextResponse.json({ message: "success", data: response });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
