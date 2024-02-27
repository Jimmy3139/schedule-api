/*
https://docs.nestjs.com/controllers#controllers
*/
import { Controller, Post, Body, ForbiddenException, Put } from '@nestjs/common';
import { MemberService } from './member.service';
import { GetUserRespDto } from './dto/login.dto';
import { RespBody } from 'src/typing/response';

@Controller('member')
export class MemberController { 
    constructor(private readonly loginService: MemberService) {}

    //登入
    @Post('login')
    async loginUser(@Body() loginData: { account: string; pwd: string }): Promise<RespBody<GetUserRespDto>> {
      try {
        const resp = await this.loginService.login(loginData.account, loginData.pwd);
        return resp;
      } catch (error) {
        if (error instanceof ForbiddenException) {
          throw new ForbiddenException('Invalid account or password');
        }
        throw error;
      }
    }

    //測試登入的token是否有效
    @Post('test')
    async test(@Body() token: { token: string }): Promise<RespBody<GetUserRespDto>> {
      try {
        //初始化
        const resp = await new RespBody<GetUserRespDto>({
          code: 200,
          isSuccess: true,
          data: null
        });
        return resp;
      } catch (error) {
        if (error instanceof ForbiddenException) {
          throw new ForbiddenException('Invalid account or password');
        }
        throw error;
      }
    }
     //註冊
     @Post('register')
     async registerUser1(@Body() model: RegisterViewModel): Promise<RespBody<string>> {
       try {
         const resp = await this.loginService.register(model);
         return resp;
       } catch (error) {
         if (error instanceof ForbiddenException) {
           throw new ForbiddenException('Invalid account or password');
         }
         throw error;
       }
     }

    //RefreshToken產生新的JWT Token
    @Post('refresh-token')
    async refreshToken(@Body() token: { token: string }): Promise<RespBody<GetUserRespDto>> {
      try {
        const resp = await this.loginService.refreshToken(token.token);
        return resp;
      } catch (error) {
        if (error instanceof ForbiddenException) {
          throw new ForbiddenException('Invalid account or password');
        }
        throw error;
      }
    }

}
