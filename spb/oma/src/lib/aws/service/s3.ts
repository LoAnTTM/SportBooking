import { S3 } from 'aws-sdk';

import {
  S3Config,
  S3DeleteObjectOutput,
  S3DeleteObjectRequest,
  S3GetObjectOutput,
  S3GetObjectRequest,
  S3ListObjectsOutput,
  S3ListObjectsRequest,
  S3PutObjectRequest,
  S3SendData,
} from '../types';
import { BaseAWSService } from './base';

class S3Service extends BaseAWSService<S3Config> {
  private static _instance: S3Service;
  public defaultBucket: string = '';

  private constructor(config: S3Config) {
    super(
      new S3({
        endpoint: config.endpoint,
        s3ForcePathStyle: true,
        signatureVersion: 'v4',
      }),
      config
    );

    this.defaultBucket = config.bucket;
  }

  static getInstance(config: S3Config): S3Service {
    if (!this._instance) {
      this._instance = new S3Service(config);
    }
    return this._instance;
  }

  async upload(params: S3PutObjectRequest): Promise<S3SendData> {
    return this.callMethod('upload', {
      ...params,
      Bucket: params.Bucket || this.defaultBucket,
    });
  }

  async get(params: S3GetObjectRequest): Promise<S3GetObjectOutput> {
    return this.callMethod('getObject', {
      ...params,
      Bucket: params.Bucket || this.defaultBucket,
    });
  }

  async delete(params: S3DeleteObjectRequest): Promise<S3DeleteObjectOutput> {
    return this.callMethod('deleteObject', {
      ...params,
      Bucket: params.Bucket || this.defaultBucket,
    });
  }

  async list(params: S3ListObjectsRequest): Promise<S3ListObjectsOutput> {
    return this.callMethod('listObjects', {
      ...params,
      Bucket: params.Bucket || this.defaultBucket,
    });
  }
}

export default S3Service;
