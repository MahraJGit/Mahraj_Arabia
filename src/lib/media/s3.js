import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

function createClient() {
  return new S3Client({
    region: process.env.S3_REGION,
    followRegionRedirects: true,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
    },
  });
}

export function s3Enabled() {
  return Boolean(
    process.env.S3_BUCKET?.trim() &&
      process.env.S3_REGION?.trim() &&
      process.env.S3_ACCESS_KEY_ID &&
      process.env.S3_SECRET_ACCESS_KEY
  );
}

export async function putObject(key, body, contentType) {
  await createClient().send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );
}

export async function deleteObject(key) {
  if (!key) return;
  try {
    await createClient().send(
      new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: key,
      })
    );
  } catch (error) {
    const status = error?.$metadata?.httpStatusCode;
    const name = error?.name;
    if (name === "NoSuchKey" || name === "NotFound" || status === 404) {
      return;
    }
    throw error;
  }
}

export async function getObjectStream(key) {
  try {
    const result = await createClient().send(
      new GetObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: key,
      })
    );

    if (!result.Body) return null;

    return {
      stream: result.Body.transformToWebStream(),
      contentType: result.ContentType || "",
    };
  } catch (error) {
    const status = error?.$metadata?.httpStatusCode;
    const name = error?.name;
    if (name === "NoSuchKey" || name === "NotFound" || status === 404) {
      return null;
    }
    throw error;
  }
}
