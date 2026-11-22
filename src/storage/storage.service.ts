import { Injectable } from '@nestjs/common';
import {
  S3Client, PutObjectCommand, DeleteObjectCommand,
} from '@aws-sdk/client-s3';

@Injectable()
export class StorageService {
  private bucket = process.env.NEON_BUCKET!;

  private s3 = new S3Client({
    region: process.env.AWS_REGION,
    endpoint: process.env.AWS_ENDPOINT_URL_S3,
    forcePathStyle: true, // obrigatório no Neon
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  async upload(key: string, body: Buffer) {
    await this.s3.send(new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: body,
      ContentType: 'image/webp',
      CacheControl: 'public, max-age=31536000', // navegador guarda a foto em cache
    }));
    return key;
  }

  async remove(keys: string[]) {
    await Promise.all(keys.map((Key) =>
      this.s3.send(new DeleteObjectCommand({ Bucket: this.bucket, Key }))
        .catch(() => {})));
  }

  // monta o endereço público a partir da chave
  publicUrl(key: string) {
    return `${process.env.AWS_ENDPOINT_URL_S3}/${this.bucket}/${key}`;
  }
}