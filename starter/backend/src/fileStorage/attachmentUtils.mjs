import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3 = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' })
const bucketName = process.env.ATTACHMENT_S3_BUCKET
const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)

export async function getUploadUrl(userId, todoId) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: `${userId}/${todoId}`,
    ContentType: 'image/*'
  })

  const url = await getSignedUrl(s3, command, { expiresIn: urlExpiration })
  return url
}

export function getAttachmentUrl(userId, todoId) {
  return `https://${bucketName}.s3.amazonaws.com/${userId}/${todoId}`
}
