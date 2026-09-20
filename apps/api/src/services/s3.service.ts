import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client, AWS_CONFIG } from '../config/aws.js';
import { v4 as uuidv4 } from 'uuid';

export class S3StorageService {
  public static async generateUploadPresignedUrl(
    fileName: string, 
    mimeType: string, 
    folder: 'policies' | 'evidence' | 'remediation' = 'evidence'
  ): Promise<{ uploadUrl: string; key: string; publicUrl: string }> {
    const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const key = `${folder}/${uuidv4()}-${cleanFileName}`;

    try {
      const command = new PutObjectCommand({
        Bucket: AWS_CONFIG.s3Bucket,
        Key: key,
        ContentType: mimeType
      });

      const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 });
      const publicUrl = `https://${AWS_CONFIG.s3Bucket}.s3.${AWS_CONFIG.region}.amazonaws.com/${key}`;

      return { uploadUrl, key, publicUrl };
    } catch (err) {
      // Fallback for demo mode if AWS credentials not configured
      const key = `${folder}/${uuidv4()}-${cleanFileName}`;
      const publicUrl = `https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80`;
      return {
        uploadUrl: `https://api.groundtruth.internal/mock-s3-upload/${key}`,
        key,
        publicUrl
      };
    }
  }

  public static async generateDownloadPresignedUrl(key: string): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: AWS_CONFIG.s3Bucket,
        Key: key
      });
      return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    } catch (err) {
      return `https://${AWS_CONFIG.s3Bucket}.s3.${AWS_CONFIG.region}.amazonaws.com/${key}`;
    }
  }
}
