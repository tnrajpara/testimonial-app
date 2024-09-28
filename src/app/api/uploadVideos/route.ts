import { NextResponse } from "next/server";
import { Vimeo } from "@vimeo/vimeo";
import fs from "fs";
import os from "os";
import path from "path";
import dbConnect from "../../utils/dbConnect";

const client = new Vimeo(
  process.env.VIMEO_CLIENT_ID as string,
  process.env.VIMEO_CLIENT_SECRET as string,
  process.env.VIMEO_ACCESS_TOKEN as string
);

export async function POST(request: Request) {
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
    return NextResponse.json(
      { error: "No video file provided" },
      { status: 400 }
    );
  }

  // Create a temporary file
  const tempFilePath = path.join(os.tmpdir(), file.name);
  const fileBuffer = await file.arrayBuffer();
  fs.writeFileSync(tempFilePath, Buffer.from(fileBuffer));

  console.log("Uploading:", tempFilePath);

  const params = {
    name: `Uploaded video ${new Date().toISOString()}`,
    description:
      "This video was uploaded through the Vimeo API's NodeJS SDK in a Next.js API route.",
  };

  return new Promise(async (resolve) => {
    client.upload(
      tempFilePath,
      params,
      function (uri) {
        client.request(
          uri + "?fields=link,name,description,transcode.status",
          async function (error, body, statusCode, headers) {
            if (error) {
              console.log("There was an error making the request.");
              console.log("Server reported:", error);
              resolve(
                NextResponse.json({ error: "Upload failed" }, { status: 500 })
              );
              return;
            }

            console.log(`"${tempFilePath}" has been uploaded to ${body.link}`);
            console.log("Name:", body.name);
            console.log("Description:", body.description);
            console.log("Transcode status:", body.transcode.status);

            // Clean up the temporary file
            fs.unlinkSync(tempFilePath);

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

            console.log("result -", result);
            resolve(
              NextResponse.json({
                success: true,
                link: body.link,
                name: body.name,
                description: body.description,
                transcodeStatus: body.transcode.status,
              })
            );
          }
        );
      },
      function (bytesUploaded, bytesTotal) {
        const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
        console.log(bytesUploaded, bytesTotal, percentage + "%");
      },
      function (error) {
        console.log("Failed because:", error);
        // Clean up the temporary file
        fs.unlinkSync(tempFilePath);
        resolve(
          NextResponse.json(
            { error: "Upload failed: " + error },
            { status: 500 }
          )
        );
      }
    );
  });
}
