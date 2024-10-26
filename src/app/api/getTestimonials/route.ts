import dbConnect from "../../utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";

export async function GET(req: NextRequest) {
  const res = new NextResponse();
  const session = await getSession(req, res);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const spaceId = req.nextUrl.searchParams.get("id")?.toString();

  if (!spaceId) {
    return NextResponse.json(
      { error: "Space ID is required" },
      { status: 400 }
    );
  }

  const { db } = await dbConnect();

  try {
    // First, check if the space exists and if the user has access to it
    const space = await db
      .collection("spaces-db")
      .findOne({ spaceId: spaceId });

    if (!space) {
      return NextResponse.json({ error: "Space not found" }, { status: 404 });
    }

    let id = session.user.sub.split("-")[1].split("|")[1];

    if (space.userId !== id) {
      return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    }

    // If authorized, fetch the testimonials
    const testimonialData = await db
      .collection("testimonial-data")
      .find({ spaceId: spaceId })
      .toArray();

    // Process the data to handle both text and video testimonials
    const processedData = testimonialData.map((testimonial: any) => {
      if (testimonial.type === "video") {
        return {
          _id: testimonial._id,
          type: "video",
          link: testimonial.link,
          name: testimonial.name,
          uploadedAt: testimonial.uploadedAt,
          rating: testimonial.rating,
          extraQuestionValues: testimonial.extraQuestionValues || {},
          isLiked: false,
          spaceId: testimonial.spaceId,
        };
      }
      // For text testimonials, return as is
      return {
        ...testimonial,
        isLiked: false,
      };
    });

    return NextResponse.json({ data: processedData });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
