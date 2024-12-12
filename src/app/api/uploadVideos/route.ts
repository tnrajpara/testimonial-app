import { NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import dbConnect from "../../../utils/dbConnect";
import streamifier from "streamifier";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("video") as File | null;
  const name = formData.get("name") as string;
  const rating = formData.get("rating") as string;
  const type = formData.get("type") as string;
  const spaceId = formData.get("spaceId") as string;
  const extraQuestionValuesString = formData.get(
    "extraQuestionValues"
  ) as string;

  let extraQuestionValues = {};
  if (extraQuestionValuesString) {
    try {
      extraQuestionValues = JSON.parse(extraQuestionValuesString);
    } catch (error) {
      console.error("Error parsing extraQuestionValues:", error);
    }
  }

  if (!file) {
    return new Response(JSON.stringify({ error: "No video file provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Convert the file to a buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Cloudinary using stream
    return new Promise<Response>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "video",
          folder: "testimonials",
          allowed_formats: ["mp4", "mov", "avi", "webm", "mkv"],
          transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
          eager_async: true,
        },
        async (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            return resolve(
              new Response(JSON.stringify({ error: "Upload failed" }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
              })
            );
          }

          try {
            // Connect to database and save video data
            const { db } = await dbConnect();
            const videoData = {
              link: result?.secure_url,
              publicId: result?.public_id,
              uploadedAt: new Date(),
              name,
              extraQuestionValues,
              rating,
              type,
              spaceId,
              duration: result?.duration,
              format: result?.format,
            };

            const dbResult = await db
              .collection("testimonial-data")
              .insertOne(videoData);

            console.log("Database Insert Result:", dbResult);

            // Return success response with video details
            resolve(
              new Response(
                JSON.stringify({
                  success: true,
                  link: result?.secure_url,
                  publicId: result?.public_id,
                  thumbnail: result?.thumbnail_url,
                  duration: result?.duration,
                }),
                {
                  status: 200,
                  headers: { "Content-Type": "application/json" },
                }
              )
            );
          } catch (dbError) {
            console.error("Database error:", dbError);
            resolve(
              new Response(
                JSON.stringify({ error: "Error saving to database" }),
                {
                  status: 500,
                  headers: { "Content-Type": "application/json" },
                }
              )
            );
          }
        }
      );

      // Pipe the buffer to the upload stream
      streamifier.createReadStream(buffer).pipe(uploadStream);
    });
  } catch (error) {
    console.error("Error during video upload:", error);
    return new Response(
      JSON.stringify({ error: "Something went wrong during video upload" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// Add a DELETE route to handle video deletion if needed
export async function DELETE(request: NextRequest) {
  const { publicId } = await request.json();

  if (!publicId) {
    return new Response(JSON.stringify({ error: "No public ID provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "video",
    });

    // Delete from database
    const { db } = await dbConnect();
    await db.collection("testimonial-data").deleteOne({ publicId });

    return new Response(JSON.stringify({ success: true, result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error deleting video:", error);
    return new Response(JSON.stringify({ error: "Failed to delete video" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
