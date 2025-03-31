import { AWS_SERVICES, AWSServiceConfig, S3Config } from '../types';
import S3Service from './s3';

type AWSServiceType<T extends AWS_SERVICES> = T extends AWS_SERVICES.S3
  ? S3Service
  : never;

const awsService = <T extends AWS_SERVICES, K extends AWSServiceConfig>(
  service: T,
  config: K
): AWSServiceType<T> => {
  switch (service) {
    case AWS_SERVICES.S3:
      return S3Service.getInstance(
        config as unknown as S3Config
      ) as AWSServiceType<T>;
    default:
      throw new Error('Service not found');
  }
};

export default awsService;
