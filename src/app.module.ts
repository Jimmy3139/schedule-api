import { MemberModule } from './modules/member/member.module';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtMiddleware } from './packages/middleware/jwt-token-auth.middleware';
import { JwtUtility } from './packages/jwt-auth/jwt.utility';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './modules/redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RedisModule,
    TypeOrmModule.forRoot({
      type: process.env.TYPEORM_CONNECTION as any,
      host: process.env.TYPEORM_HOST,
      port: +process.env.TYPEORM_PORT,
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
      synchronize: process.env.TYPEORM_SYNC === 'true',
      logging: process.env.TYPEORM_LOGGING === 'true',
      entities: ['./**/*.entity.js'],
    }),
    MemberModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtUtility],
})
export class AppModule {
  constructor() {
    console.log("env : ", process.env.TYPEORM_CONNECTION);
  }
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .exclude(
        { path: 'member/login', method: RequestMethod.POST },
        { path: 'member/login1', method: RequestMethod.POST },
        { path: 'member/register', method: RequestMethod.POST },
        { path: 'member/register1', method: RequestMethod.POST },
        { path: 'member/refresh-token', method: RequestMethod.POST },
      )
      .forRoutes('*');  // 使用這個middleware於所有路由
  }
}
