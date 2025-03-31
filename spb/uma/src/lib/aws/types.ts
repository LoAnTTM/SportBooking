import { S3 as AWSS3 } from 'aws-sdk';

export enum AWS_SERVICES {
  S3,
}
export interface AWSServiceConfig {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
}

export interface S3Config extends AWSServiceConfig {
  bucket: string;
  endpoint: string;
}

export interface S3PutObjectRequest
  extends Omit<AWSS3.PutObjectRequest, 'Bucket'> {
  Bucket?: string | undefined;
}

export interface S3GetObjectRequest
  extends Omit<AWSS3.GetObjectRequest, 'Bucket'> {
  Bucket?: string | undefined;
}

export interface S3DeleteObjectRequest
  extends Omit<AWSS3.DeleteObjectRequest, 'Bucket'> {
  Bucket?: string | undefined;
}

export interface S3ListObjectsRequest
  extends Omit<AWSS3.ListObjectsRequest, 'Bucket'> {
  Bucket?: string | undefined;
}

export interface S3SendData extends AWSS3.ManagedUpload.SendData {}

export interface S3GetObjectOutput extends AWSS3.GetObjectOutput {}

export interface S3DeleteObjectOutput extends AWSS3.DeleteObjectOutput {}

export interface S3ListObjectsOutput extends AWSS3.ListObjectsOutput {}
