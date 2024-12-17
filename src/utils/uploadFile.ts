import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  region: "default",
  endpoint: process.env.LIARA_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.LIARA_ACCESS_KEY!,
    secretAccessKey: process.env.LIARA_SECRET_KEY!,
  },
});

export const uploadFile = async (file: any) => {
  if (!file) return false;

  const uploadParams = {
    Bucket: process.env.LIARA_BUCKET_NAME,
    Key: file.originalname,
    Body: file.buffer,
  };

  try {
    const command = new PutObjectCommand(uploadParams);
    const response = await s3.send(command);
    return `https://${process.env.LIARA_BUCKET_NAME}.storage.c2.liara.space/${file.originalname}`;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("File upload failed");
  }
};
