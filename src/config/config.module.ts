import { Module, Global, OnModuleInit } from '@nestjs/common';
import { ConfigService } from './config.service';


@Global()
@Module({
  providers: [
    {
      provide: ConfigService,
      useFactory: async () => {
        const environment = process.env.NODE_ENV || 'local';
        const configService = new ConfigService();

        if (environment === 'production') {
          await configService.loadFromAWSSSM();
        }

        return configService;
      },
    },
  ],
  exports: [ConfigService],
})
export class ConfigModule  {
    constructor(private readonly configService: ConfigService) {

    }

    async onModuleInit() {
       await this.configService.loadFromAWSSSM();
    }



}