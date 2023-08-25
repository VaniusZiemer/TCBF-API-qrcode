import * as dotenv from 'dotenv';
import * as AWS from 'aws-sdk';

import { IsString, IsNotEmpty, validateSync } from 'class-validator';
import { Injectable } from '@nestjs/common';


dotenv.config();

export enum Environment {
    LOCAL = 'local',
    DEVELOPMENT = 'development',
    STAGING = 'staging',
    PRODUCTION = 'production'
    }

class EnvironmentVariables {
    @IsNotEmpty()
    @IsString()
    ENV_VAR_1: string;
  
    @IsNotEmpty()
    @IsString()
    ENV_VAR_2: string;
  }

  
  @Injectable()
  export class ConfigService {
    private environment: string;
    private readonly ssm: AWS.SSM;
    private readonly envVariables: EnvironmentVariables;
  
    constructor() {
      this.environment = process.env.NODE_ENV || 'production';
      
      const credentialTest = new AWS.Credentials({
        accessKeyId: '',
        secretAccessKey: ''
      });
      AWS.config.update({ region: 'us-east-1', credentials: credentialTest });
  
      this.ssm = new AWS.SSM();
      this.envVariables = this.loadFromEnv();
    }
  
    private loadFromEnv(): EnvironmentVariables {
      const envVars: EnvironmentVariables = {
        ENV_VAR_1: process.env.ENV_VAR_1,
        ENV_VAR_2: process.env.ENV_VAR_2,
      };
  
      const validationErrors = validateSync(envVars);
      if (validationErrors.length > 0) {
        throw new Error(`Validation error in environment variables: ${validationErrors}`);
      }
  
      return envVars;
    }
  
    async loadFromAWSSSM(): Promise<void> {
      if (this.environment === 'production') {
        const parameterNames = ['SSM_PARAM_1']; // Substitua pelos nomes corretos
        const ssmParams = await Promise.all(
          parameterNames.map(async (paramName) => {
            const parameter = await this.ssm.getParameter({
              Name: paramName,
              WithDecryption: true,
            }).promise();
            return { [paramName]: parameter.Parameter?.Value };
          }),
        );
  
        Object.assign(this.envVariables, ...ssmParams);
      }
    }
  
    get(key: keyof EnvironmentVariables): string | undefined {
      return this.envVariables[key];
    }
  }