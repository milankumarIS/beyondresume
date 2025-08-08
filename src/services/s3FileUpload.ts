import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const REGION = "ap-south-1";
const BUCKET_NAME = "mydailylives";

const ACCESS_KEY_ID = "AKIAYQYUBFDX2MZBLIXU";
const SECRET_ACCESS_KEY = "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";


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
    Bucket:BUCKET_NAME,
    Key: key,
    Body: file,
    ACL: "public-read",
    ContentType: file.type || "video/webm",
  });

  await s3.send(putCommand);

  const s3Url = `https://mydailylives.s3.ap-south-1.amazonaws.com/${key}`;
  return s3Url;
}
