import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,private readonly authService: AuthService) {}

  @ApiTags('Authentication')
  @ApiOperation({ summary: 'Create authentication token' })
  @ApiOkResponse({ description: 'Token created successfully' })
  @Get('create-token')
  async createToken() {
    const defaultUser = { id: 1, username: 'user' };
    const token = await this.authService.createToken(defaultUser);
    return { token };
  }
}
