import { Injectable, Inject } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';


export interface MemberTokenInfo {
  id: bigint;
  isPassTeacher?: boolean | 0;
  isPassPersonal?: boolean | 0;
  userType?: string;
  teacherId?: bigint | 0;
  storeId?: bigint | 0;
  // ...
}
export interface InRefreshTokenDto {
  token: string;
  expires: Date;
  createdAt: Date;
}

@Injectable()
export class JwtUtility {

  ///產生JWT Token  有效期 30分鐘
  generateJwtToken(info: MemberTokenInfo): string {
    const securityKey = process.env.JWT_SECRET_KEY;
    const issuer = process.env.JWT_ISSUER;
    const audience = process.env.JWT_AUDIENCE;
    const expires = +process.env.JWT_EXPIRES; // 假定此值為分鐘

    const payload = {
      id: JSON.stringify(info),
      iss: issuer,
      aud: audience,
      exp: Math.floor(Date.now() / 1000) + (expires * 60) // 轉換為Unix時間戳
    };

    return jwt.sign(payload, securityKey, { algorithm: 'HS256' });
  }

  ///驗證JWT Token
  verifyJwtToken(token: string): MemberTokenInfo {
    const securityKey = process.env.JWT_SECRET_KEY;
    const issuer = process.env.JWT_ISSUER;
    const audience = process.env.JWT_AUDIENCE;

    const payload = jwt.verify(token, securityKey, { issuer, audience, algorithms: ['HS256'] })
    var result = JSON.parse(payload.id);
    return result;
  }

  ///產生refresh token
  generateRefreshToken(): InRefreshTokenDto {
    const refreshTokenTTL = +process.env.JWT_EXPIRES;; // 假定此值為天數
    const randomBytesBuffer = randomBytes(64);

    const refreshToken: InRefreshTokenDto = {
      token: randomBytesBuffer.toString('base64'),
      expires: new Date(Date.now() + refreshTokenTTL * 24 * 60 * 60 * 1000), // 轉換為毫秒
      createdAt: new Date()
    };

    return refreshToken;
  }


}
