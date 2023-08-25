import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { AuthService } from 'src/auth/auth.service';

@Module({
  controllers: [FilesController],
  providers: [FilesService, AuthService]
})
export class FilesModule {}
