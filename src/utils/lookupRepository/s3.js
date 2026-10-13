import { CloudFrontClient, CreateInvalidationCommand } from '@aws-sdk/client-cloudfront'
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'

const s3 = new S3Client({ region: process.env.AWS_REGION })
const cf = new CloudFrontClient({ region: process.env.AWS_REGION })
const BUCKET = `${process.env.PROJECT}-${process.env.STAGE}-data`

export const readJSON = async (key) => {
  try {
    const response = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }))
    const raw = await response.Body.transformToString()
    return JSON.parse(raw)
  } catch (err) {
    if (err.name === 'NoSuchKey' || err.name === 'AccessDenied') return null
    throw err
  }
}

export const writeJSON = async (key, data, ttl = null) => {
  let cmd = {
    Bucket: BUCKET,
    Key: key,
    Body: JSON.stringify(data),
    ContentType: 'application/json',
  }

  if (ttl) cmd['CacheControl'] = `max-age=${ttl}`
  await s3.send(new PutObjectCommand(cmd))
}

export const invalidate = async (paths) => {
  await cf.send(new CreateInvalidationCommand({
    DistributionId: process.env.CLOUDFRONT_DIST_ID,
    InvalidationBatch: {
      CallerReference: `${Date.now()}`,
      Paths: { Quantity: paths.length, Items: paths }
    }
  }))
}