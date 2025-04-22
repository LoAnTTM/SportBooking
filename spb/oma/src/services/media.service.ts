import {
  S3DeleteObjectOutput, S3DeleteObjectRequest, S3GetObjectOutput, S3GetObjectRequest,
  S3ListObjectsOutput, S3PutObjectRequest, S3SendData
} from '@/lib/aws/types';
import { s3Factory } from '@/services/aws';

export interface IMediaService {
  upload(file: File, bucket?: string): Promise<S3SendData>;
  get(url: string, bucket?: string): Promise<S3GetObjectOutput>;
  delete(url: string, bucket?: string): Promise<S3DeleteObjectOutput>;
  list(bucket?: string): Promise<S3ListObjectsOutput>;
}

class MediaService implements IMediaService {
  public async upload(file: File, bucket?: string): Promise<S3SendData> {
    const params: S3PutObjectRequest = {
      Bucket: bucket,
      Key: file.name,
      Body: file,
      ContentType: file.type,
    };

    return await s3Factory.upload(params);
  }

  public async get(url: string, bucket?: string): Promise<S3GetObjectOutput> {
    const params: S3GetObjectRequest = {
      Bucket: bucket,
      Key: url,
    };

    return await s3Factory.get(params);
  }

  public async delete(
    url: string,
    bucket?: string
  ): Promise<S3DeleteObjectOutput> {
    const params: S3DeleteObjectRequest = {
      Bucket: bucket,
      Key: url,
    };

    return await s3Factory.delete(params);
  }

  public async list(bucket?: string): Promise<S3ListObjectsOutput> {
    const params = {
      Bucket: bucket,
    };

    return await s3Factory.list(params);
  }
}

const mediaService = new MediaService();
export default mediaService;
