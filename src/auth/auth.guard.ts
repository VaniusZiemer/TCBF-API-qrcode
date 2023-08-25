
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext):  Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request) {
      return false;
    }
    if (!request.headers.authorization) {
      return false;
    }
    if (!request.headers.authorization.startsWith('Bearer ')) {
      return false;
    }
    const token = request.headers.authorization?.replace('Bearer ', '');
    if (token) {
      const decodedToken = await this.authService.verifyToken(token);
      if (decodedToken) {
        request.user = decodedToken; // Armazena as informações do usuário no objeto de solicitação
        return true;
      }
    }

    return false;
  }
}