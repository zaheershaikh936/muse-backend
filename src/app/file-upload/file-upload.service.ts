import { S3 } from 'aws-sdk';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FileUploadService {
  async upload(files) {
    const data = [];
    for (const file of files) {
      const { originalname, mimetype } = file;
      const folderPath = this.getFolderPath();
      const sanitizedFileName = originalname.replace(/[^a-zA-Z0-9-_\.]/g, '_');
      const result: Record<string, unknown> = (await this.uploadS3(
        file.buffer,
        `${folderPath}/${mimetype.split('/')[0]}/${sanitizedFileName}`,
      )) as Record<string, unknown>;
      data.push(result?.Location);
    }
    return data;
  }

  async uploadS3(file: Buffer, name: string) {
    const s3 = this.getS3();
    const params: S3.Types.PutObjectRequest = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: name,
      Body: file,
    };

    console.log('Uploading to S3 with params:', params);

    const data = await new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          console.error('Error uploading to S3:', err);
          reject(err.message);
        }
        resolve(data);
      });
    });
    console.log('Upload successful:', data);
    return data;
  }

  getS3() {
    return new S3({
      region: process.env.S3_REGION,
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      signatureVersion: 'v4', // Explicitly set the signature version if not already set
    });
  }

  getFolderPath() {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const day = String(new Date().getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  }
}
