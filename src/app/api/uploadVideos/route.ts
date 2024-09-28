import { NextRequest } from "next/server";
import { Vimeo } from "@vimeo/vimeo";
import fs from "fs";
import os from "os";
import path from "path";
import dbConnect from "../../utils/dbConnect";

// Initialize Vimeo client
const client = new Vimeo(
  process.env.VIMEO_CLIENT_ID as string,
  process.env.VIMEO_CLIENT_SECRET as string,
  process.env.VIMEO_ACCESS_TOKEN as string
);

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

  // If no file is provided, return an error response
  if (!file) {
    return new Response(JSON.stringify({ error: "No video file provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Create a temporary file path for the video
  const tempFilePath = path.join(os.tmpdir(), file.name);
  const fileBuffer = await file.arrayBuffer();
  fs.writeFileSync(tempFilePath, Buffer.from(fileBuffer));

  console.log("Uploading:", tempFilePath);

  const params = {
    name: `Uploaded video ${new Date().toISOString()}`,
    description:
      "This video was uploaded through the Vimeo API's NodeJS SDK in a Next.js API route.",
  };

  try {
    // Upload the video to Vimeo and handle the response
    return new Promise<Response>((resolve, reject) => {
      client.upload(
        tempFilePath,
        params,
        function (uri) {
          client.request(
            `${uri}?fields=link,name,description,transcode.status`,
            async function (error, body) {
              // Handle errors during request
              if (error) {
                console.error("There was an error making the request:", error);
                fs.unlinkSync(tempFilePath);
                return resolve(
                  new Response(JSON.stringify({ error: "Upload failed" }), {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                  })
                );
              }

              // Log upload details and clean up temporary file
              console.log(
                `"${tempFilePath}" has been uploaded to ${body.link}`
              );
              console.log("Name:", body.name);
              console.log("Description:", body.description);
              console.log("Transcode status:", body.transcode.status);
              fs.unlinkSync(tempFilePath);

              // Connect to the database and save video data
              const { db } = await dbConnect();
              const videoData = {
                link: body.link,
                uploadedAt: new Date(),
                name,
                extraQuestionValues,
                rating,
                type,
                spaceId,
              };
              const result = await db.collection("videos").insertOne(videoData);

              console.log("Database Insert Result:", result);

              // Respond with success message and video details
              resolve(
                new Response(
                  JSON.stringify({
                    success: true,
                    link: body.link,
                    name: body.name,
                    description: body.description,
                    transcodeStatus: body.transcode.status,
                  }),
                  {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                  }
                )
              );
            }
          );
        },
        function (bytesUploaded, bytesTotal) {
          const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
          console.log(
            `Progress: ${percentage}% (${bytesUploaded}/${bytesTotal})`
          );
        },
        function (error) {
          console.error("Failed because:", error);
          // Clean up the temporary file and return a failure response
          fs.unlinkSync(tempFilePath);
          reject(
            new Response(JSON.stringify({ error: "Upload failed: " + error }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            })
          );
        }
      );
    });
  } catch (error) {
    console.error("Error during video upload:", error);
    return new Response(
      JSON.stringify({ error: "Something went wrong during video upload" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
