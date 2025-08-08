import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const REGION = import.meta.env.VITE_AWS_REGION;
const BUCKET_NAME = import.meta.env.VITE_AWS_BUCKET_NAME;
const ACCESS_KEY_ID = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;

export async function s3FileUpload(file: File | Blob) {
  const s3 = new S3Client({
    region: REGION,
    credentials: {
      accessKeyId: ACCESS_KEY_ID,
      secretAccessKey: SECRET_ACCESS_KEY,
    },
  });

  const key = `uploads/${Date.now()}-${file instanceof File ? file.name : "video.webm"}`;

  const putCommand = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file,
    ACL: "public-read",
    ContentType: file.type || "video/webm",
  });

  await s3.send(putCommand);

  const s3Url = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${key}`;
  return s3Url;
}
