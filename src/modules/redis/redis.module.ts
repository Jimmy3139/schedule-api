// redis.module.ts
import { Module, Global } from '@nestjs/common';
import Redis from 'ioredis';


@Global()
@Module({})
export class RedisModule {
    static redisClient: Redis;
  
    constructor() {
      RedisModule.redisClient = new Redis({
        host: process.env.REDIS_HOST,
        port: +process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
      });
    }
}
  
