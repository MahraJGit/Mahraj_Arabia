export function s3Enabled(): boolean;

export function putObject(
  key: string,
  body: Buffer,
  contentType: string
): Promise<void>;

export function deleteObject(key: string): Promise<void>;

export function getObjectStream(key: string): Promise<{
  stream: ReadableStream;
  contentType: string;
} | null>;
