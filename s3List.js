import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";

const client = new S3Client({});

const main = async () => {
  try {
    const command = new ListBucketsCommand({});
    const data = await client.send(command);
    console.log("Your buckets:");
    data.Buckets.forEach(bucket => {
      console.log(`- ${bucket.Name}`);
    });
  } catch (err) {
    console.error(err);
  }
};

main();
