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

    // Process the data to handle both text and video testimonials
    const processedData = spaceData.map((testimonial: any) => {
      if (testimonial.type === "video") {
        return {
          _id: testimonial._id,
          type: "video",
          link: testimonial.link,
          name: testimonial.name,
          uploadedAt: testimonial.uploadedAt,
          rating: testimonial.rating,
          extraQuestionValues: testimonial.extraQuestionValues || {},
          isLiked: false, // You might want to implement a mechanism to track liked status
          spaceId: testimonial.spaceId,
        };
      }
      // For text testimonials, return as is
      return {
        ...testimonial,
        isLiked: false, // You might want to implement a mechanism to track liked status
      };
    });

    return NextResponse.json({ data: processedData });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
