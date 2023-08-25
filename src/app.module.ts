import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FilesModule } from './files/files.module';
import { AuthService } from './auth/auth.service';
// import { ConfigModule } from './config/config.module';


@Module({
  imports: [ FilesModule],
  controllers: [AppController],
  providers: [AppService, AuthService],
})
export class AppModule  {
}
