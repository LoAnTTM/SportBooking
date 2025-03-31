import { ResponseError } from '@/helpers/error';
import i18next from '@/helpers/i18n';
import { logError } from '@/helpers/logger';
import awsService from '@/lib/aws/service';
import { AWS_SERVICES } from '@/lib/aws/types';
import {
  CLOUD_ACCESS_KEY,
  CLOUD_ENDPOINT,
  CLOUD_MEDIA_BUCKET,
  CLOUD_REGION,
  CLOUD_SECRET_KEY,
} from '@env';

export const awsResponseParse = <T>(response: Promise<T>): Promise<T> => {
  return response
    .then((res) => res)
    .catch((error) => {
      logError(error as Error);
      throw new ResponseError(i18next.t('error.ERS001'));
    });
};

const createS3Factory = () => {
  const s3Service = awsService(AWS_SERVICES.S3, {
    accessKeyId: CLOUD_ACCESS_KEY,
    secretAccessKey: CLOUD_SECRET_KEY,
    region: CLOUD_REGION,
    bucket: CLOUD_MEDIA_BUCKET,
    endpoint: CLOUD_ENDPOINT,
  });

  return {
    upload: (params: any) => {
      return awsResponseParse(s3Service.upload(params));
    },
    get: (params: any) => {
      return awsResponseParse(s3Service.get(params));
    },
    delete: (params: any) => {
      return awsResponseParse(s3Service.delete(params));
    },
    list: (params: any) => {
      return awsResponseParse(s3Service.list(params));
    },
  };
};

export const s3Factory = createS3Factory();
