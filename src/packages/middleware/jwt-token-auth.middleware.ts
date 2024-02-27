import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtUtility, MemberTokenInfo } from '../jwt-auth/jwt.utility';
import { REDIS_KEY_MEMBER } from 'src/typing/const/redis-key.const';
import { RedisModule } from 'src/modules/redis/redis.module';



interface RequestWithUser extends Request {
    user?: MemberTokenInfo;
}

@Injectable()
export class JwtMiddleware implements NestMiddleware {
    constructor(private readonly jwtUtility: JwtUtility) { }

    async use(req: RequestWithUser, res: Response, next: NextFunction) {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            throw new UnauthorizedException('Token not provided');
        }

        try {
            const payload = this.jwtUtility.verifyJwtToken(token);
            const sprintf = require('sprintf-js').sprintf;
            const redisKeyMemberToken = sprintf(REDIS_KEY_MEMBER, payload.id);
            const client = RedisModule.redisClient;

            const storedToken = await client.get(redisKeyMemberToken); // Replace with your unique identifier, maybe userId or username

            if (storedToken !== token) {
                throw new UnauthorizedException('Token mismatch with stored token');
            }

            req.user = payload;
            next();
        } catch (err) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}
