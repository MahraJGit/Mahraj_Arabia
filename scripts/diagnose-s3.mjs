import { GetObjectCommand, PutObjectCommand, DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { loadEnv } from "./lib/load-env.mjs";

loadEnv();

const id = process.env.S3_ACCESS_KEY_ID || "";
const secret = process.env.S3_SECRET_ACCESS_KEY || "";
const bucket = process.env.S3_BUCKET || "";
const region = process.env.S3_REGION || "";

console.log(
  JSON.stringify(
    {
      bucketSet: Boolean(bucket.trim()),
      region,
      accessKeyPrefix: id.slice(0, 4),
      accessKeyLength: id.length,
      secretLength: secret.length,
    },
    null,
    2
  )
);

if (!bucket || !region || !id || !secret) {
  console.log("result: missing S3 environment variables");
  process.exit(1);
}

const client = new S3Client({
  region,
  followRegionRedirects: true,
  credentials: {
    accessKeyId: id,
    secretAccessKey: secret,
  },
});

const key = `phase9-qa-${Date.now().toString(36)}.txt`;

try {
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: Buffer.from("phase9-qa"),
      ContentType: "text/plain",
    })
  );
  console.log("PutObject: ok");
} catch (error) {
  console.log(
    `PutObject: ${error instanceof Error ? error.name : "error"} ${error?.$metadata?.httpStatusCode ?? ""}`.trim()
  );
}

try {
  await client.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );
  console.log("GetObject: ok");
} catch (error) {
  console.log(
    `GetObject: ${error instanceof Error ? error.name : "error"} ${error?.$metadata?.httpStatusCode ?? ""}`.trim()
  );
}

try {
  await client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );
  console.log("DeleteObject: ok");
} catch (error) {
  console.log(
    `DeleteObject: ${error instanceof Error ? error.name : "error"} ${error?.$metadata?.httpStatusCode ?? ""}`.trim()
  );
}
