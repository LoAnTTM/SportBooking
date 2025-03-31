import AWS from 'aws-sdk';

import { AWSServiceConfig } from '../types';

export abstract class BaseAWSService<T extends AWSServiceConfig> {
  protected service: AWS.Service;

  protected constructor(service: AWS.Service, config: T) {
    AWS.config.update({
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
      region: config.region,
    });
    this.service = service;
  }

  protected async callMethod(method: string, params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      (this.service as any)[method](params, (err: AWS.AWSError, data: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
}
