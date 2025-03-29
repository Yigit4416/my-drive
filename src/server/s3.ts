"use server";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import { env } from "~/env";
import { auth } from "@clerk/nextjs/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getFileKey } from "./queries";

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

const maxSize = 5 * 1024 * 1024; // 5MB

const acceptedTypes = [
  "image/jpeg",
  "image/png",
  "application/pdf",
  "image/gif",
  "video/mp4",
  "video/webm",
];

export async function generateSignedUrl({
  contentType,
  size,
  checksum,
}: {
  contentType: string;
  size: number;
  checksum: string;
}) {
  const session = await auth();
  if (!session.userId) throw new Error("Unauthorized");

  if (!acceptedTypes.includes(contentType)) {
    throw new Error("Invalid file type");
  }

  if (size > maxSize) {
    throw new Error("File size is too large");
  }

  const generateFileName = (byte = 32) => {
    const array = new Uint8Array(byte);
    crypto.getRandomValues(array);
    return [...array].map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  const newFileName = generateFileName();

  const putObjectCommand = new PutObjectCommand({
    Bucket: bucketName,
    Key: newFileName,
    ChecksumSHA256: checksum,
    ContentType: contentType,
    Metadata: {
      "x-amz-meta-user-id": session.userId,
    },
  });

  // You have 60 seconds to upload the file
  const signedUrl = await getSignedUrl(s3, putObjectCommand, { expiresIn: 60 });

  return { success: { url: signedUrl, fileName: newFileName } };
}

export async function deleteFileItem({ itemId }: { itemId: number }) {
  try {
    const itemKey = await getFileKey({ itemId: itemId });
    const fileKey = itemKey.split("/").pop();
    const deleteCommand = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
    });
    await s3.send(deleteCommand);
  } catch (error) {
    console.log(error);
    throw new Error("Error on deleting object");
  }
}

export async function deleteMultipleFiles({
  itemKeys,
}: {
  itemKeys: string[];
}) {
  if (itemKeys.length > 0) {
    try {
      const objects = itemKeys.map((itemKey) => ({
        Key: itemKey.split("/").pop(),
      }));

      const deleteParams = {
        Bucket: env.BUCKET_NAME,
        Delete: {
          Objects: objects,
        },
      };

      const deleteCommand = new DeleteObjectsCommand(deleteParams);
      await s3.send(deleteCommand);
    } catch (error) {
      console.log(error);
    }
  }
}
