import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_SECRET_ACCESS_KEY,
  },
});

async function uploadFileToS3(fileBuffer, fileName) {
  const fileKey = `uploads/${Date.now()}-${fileName}`;

  const params = {
    Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
    Key: fileKey,
    Body: fileBuffer,
    ContentType: "image/jpeg", // Change if needed
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);

  return `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_S3_REGION}.amazonaws.com/${fileKey}`;
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files"); // Get all files

    if (!files.length) {
      return NextResponse.json(
        { error: "At least one file is required." },
        { status: 400 }
      );
    }

    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        return await uploadFileToS3(buffer, file.name);
      })
    );

    return NextResponse.json({ success: true, fileUrls: uploadedFiles });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Error uploading files" },
      { status: 500 }
    );
  }
}
