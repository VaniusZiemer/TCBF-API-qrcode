
import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  validateUser(username: any, password: any) {
      throw new Error('Method not implemented.');
  }
  private readonly JWT_SECRET = 'seu_secreto_aqui';

  async createToken(payload: any): Promise<string> {
    return jwt.sign(payload, this.JWT_SECRET, { expiresIn: '360d' });
  }

  async verifyToken(token: string): Promise<any> {
    try {
      return jwt.verify(token, this.JWT_SECRET);
    } catch (error) {
      return null;
    }
  }
}