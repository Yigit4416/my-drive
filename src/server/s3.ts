"use server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "~/env";
import { auth } from "@clerk/nextjs/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Type checking for environment variables
const bucketName = env.BUCKET_NAME || "";
const bucketRegion = env.BUCKET_REGION || "";
const accessKey = env.ACCESS_KEY || "";
const secretAccessKey = env.SECRET_ACCESS_KEY || "";

// Verify required environment variables are set
if (!bucketName || !bucketRegion || !accessKey || !secretAccessKey) {
  throw new Error("Missing required S3 configuration environment variables");
}

const s3 = new S3Client({
  region: bucketRegion,
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
});

const maxSize = 5 * 1024 * 1024 // 5MB

const acceptedTypes = [
  "image/jpeg",
  "image/png",
  "application/pdf",
  "image/gif",
  "video/mp4",
  "video/webm",
];

export async function generateSignedUrl({
  fileName,
  contentType,
  size,
  checksum,
}: {
  fileName: string;
  contentType: string;
  size: number;
  checksum: string;
}) {
  const session = await auth();
  if (!session.userId) throw new Error("Unauthorized");

  if(!acceptedTypes.includes(contentType)) {
    throw new Error("Invalid file type");
  }

  if(size > maxSize) {
    throw new Error("File size is too large");
  }

  const putObjectCommand = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileName,
    ChecksumSHA256: checksum,
    ContentType: contentType,
    Metadata: {
      "x-amz-meta-user-id": session.userId,
    }
  });


  // You have 60 seconds to upload the file
  const signedUrl = await getSignedUrl(s3, putObjectCommand, { expiresIn: 60 });

  return { success: { url: signedUrl } };
}
