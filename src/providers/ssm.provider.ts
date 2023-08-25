import * as AWS from 'aws-sdk';
import { Parameter } from 'aws-sdk/clients/ssm';

export const ssmProvider = {
  provide: 'AWS_SSM',
  useFactory: async (): Promise<Parameter[]> => {
    const ssmClient = new AWS.SSM({
      endpoint: 'endpoint',
      region: 'us-west-2',
    });
    const result = await ssmClient
      .getParametersByPath({
        Path: '/ssm/path',
        Recursive: true,
      })
      .promise();
    return result?.Parameters;
  },
};