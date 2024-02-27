import { MemberService } from './member.service';
/*
https://docs.nestjs.com/modules
*/
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from '../entities/account.entity';
import { Module } from '@nestjs/common';
import { EncryptUtility } from 'src/packages/encrypt/encrypt.utility';
import { JwtUtility } from 'src/packages/jwt-auth/jwt.utility';
import { MemberController } from './member.controller';
import { RefreshTokensEntity } from '../entities/refresh-tokens.entity';
import { TeacherDetailEntity } from '../entities/teacher-detail.entity';
import { OrganizationStoreEntity } from '../entities/organization-store.entity';


@Module({
    imports: [
      TypeOrmModule.forFeature([AccountEntity,RefreshTokensEntity,TeacherDetailEntity,OrganizationStoreEntity]) // 註冊AccountEntity的repository,
    ],
    providers: [MemberService,EncryptUtility,JwtUtility], // 註冊LoginService為提供者
    controllers: [MemberController],
    exports: [JwtUtility] // 如果你想在其他模塊中使用LoginService，則需要將其導出
  })
  export class MemberModule {}

