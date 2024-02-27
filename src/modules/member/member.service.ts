/*
https://docs.nestjs.com/providers#services
*/

import { ForbiddenException, Injectable } from '@nestjs/common';
import { AccountEntity } from '../entities/account.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GetUserRespDto } from './dto/login.dto';
import { EncryptUtility } from 'src/packages/encrypt/encrypt.utility';
import { JwtUtility, MemberTokenInfo } from 'src/packages/jwt-auth/jwt.utility';
import { HttpCodeEnum } from 'src/typing/enum/http-code.enum';
import { RespBody } from 'src/typing/response';
import { REDIS_KEY_MEMBER } from 'src/typing/const/redis-key.const';
import { RedisModule } from '../redis/redis.module';
import { RefreshTokensEntity } from '../entities/refresh-tokens.entity';
import { OrganizationStoreEntity } from '../entities/organization-store.entity';
import { TeacherDetailEntity } from '../entities/teacher-detail.entity';

@Injectable()
export class MemberService {
    constructor(
        @InjectRepository(AccountEntity)
        private readonly accountRepo: Repository<AccountEntity>,
        @InjectRepository(RefreshTokensEntity)
        private readonly refreshTokensRepo: Repository<RefreshTokensEntity>,
        @InjectRepository(OrganizationStoreEntity)
        private readonly organizationStoreRepo: Repository<OrganizationStoreEntity>,
        @InjectRepository(TeacherDetailEntity)
        private readonly teacherDetailRepo: Repository<TeacherDetailEntity>,
        private readonly encryptUtility: EncryptUtility,
        private readonly jwtUtility: JwtUtility
    ) { }

    //登入
    async login(account: string, pwd: string): Promise<RespBody<GetUserRespDto>> {
        const encryptedPwd = this.encryptUtility.aesEncrypt(pwd);
        const user = await this.accountRepo.findOne(
            {
                where: {
                    account: account,
                    password: this.encryptUtility.aesEncrypt(pwd)
                }
            }
        );
        if (!user) {
            throw new ForbiddenException();
        }
        const tokenInfo: MemberTokenInfo = {
            id: user._id,
            isPassPersonal: user.is_pass_personal,
            isPassTeacher: user.is_pass_teacher,
            userType: user.user_type,
            teacherId: user.teacher_id,
            storeId: user.b_store_id
        };
        const jwtToken = this.jwtUtility.generateJwtToken(tokenInfo);
        //寫入redis key
        const sprintf = require('sprintf-js').sprintf;
        const redisKeyMemberToken = sprintf(REDIS_KEY_MEMBER, user._id);
        const client = RedisModule.redisClient;
        await client.set(redisKeyMemberToken, jwtToken);

        const refreshToken = this.jwtUtility.generateRefreshToken();
        //把Refresh Token寫入資料庫,刪除之前的Refresh Token
        const oldRefreshTokens = await this.refreshTokensRepo.find({ where: { member_id: user._id } })
        if (oldRefreshTokens.length > 0) {
            this.refreshTokensRepo.remove(oldRefreshTokens);
        }
        //填寫好Refresh Token Entity
        const insertRefreshToken = new RefreshTokensEntity();
        insertRefreshToken.member_id = user._id;
        insertRefreshToken.token = refreshToken.token;
        insertRefreshToken.created_at = refreshToken.createdAt;
        insertRefreshToken.expires = refreshToken.expires;
        await this.refreshTokensRepo.insert(insertRefreshToken);

        const resultDto = new RespBody<GetUserRespDto>({
            isSuccess: true,
            code: HttpCodeEnum.Status200OK,
            data: {
                account: user.account,
                name: user.name,
                email: user.email,
                phoneNumber: user.phone_number,
                imgUrl: user.img_url,
                serialNumber: user.serial_number,
                createDate: user.create_date,
                lastLoginDate: user.last_login_date,
                jwtToken: jwtToken,
                referenceToken: refreshToken.token,
                userType: user.user_type,
                isPassTeacher: user.is_pass_teacher,
                isPassPersonal: user.is_pass_personal,
                teacherInfo: user.teacherDetail == null ? null :{
                    title: user.teacherDetail.title,
                    skill: user.teacherDetail.skill,
                    experiences: user.teacherDetail.experiences,
                    businessTime: JSON.parse(user.teacherDetail.business_time)
                },
                storeInfo: user.organizationStore == null ? null : {
                    level: user.organizationStore.level,
                    storeName: user.organizationStore.store_name,
                    phone: user.organizationStore.phone_number,
                    email: user.organizationStore.email,
                    address: user.organizationStore.store_address,
                    website: user.organizationStore.website,
                    businessTime: JSON.parse(user.organizationStore.business_time)
                }
            }
        });

        return resultDto;
    }
    //測試登入的jwttoken驗證是否正確
    async testJwtToken(token: string): Promise<RespBody<GetUserRespDto>> {
        const tokenInfo = this.jwtUtility.verifyJwtToken(token);
        const user = await this.accountRepo.findOne(
            {
                where: {
                    _id: BigInt(tokenInfo.id)
                }
            }
        );
        if (!user) {
            throw new ForbiddenException();
        }
        const resultDto = new RespBody<GetUserRespDto>({
            isSuccess: true,
            code: HttpCodeEnum.Status200OK,
            data: {
                account: user.account,
                name: user.name,
                email: user.email,
                phoneNumber: user.phone_number,
                imgUrl: user.img_url,
                serialNumber: user.serial_number,
                createDate: user.create_date,
                lastLoginDate: user.last_login_date,
                jwtToken: token
            }
        });

        return resultDto;
    }

    //註冊帳號密碼
    async register(model: RegisterViewModel): Promise<RespBody<string>> {
        let resultDto: RespBody<string>;
        const user = await this.accountRepo.findOne(
            {
                where: {
                    account: model.account
                }
            }
        );
        if (user) {
            resultDto = new RespBody<string>({
                isSuccess: false,
                code: HttpCodeEnum.Status400BadRequest,
                message: '帳號已存在'
            });
            return resultDto;
        }
        //簡易訊息
        const newUser = new AccountEntity();
        newUser.account = model.account;
        newUser.password = this.encryptUtility.aesEncrypt(model.password);
        newUser.name = model.realName;
        newUser.nick_name = model.nickName;
        newUser.email = model.email;
        newUser.phone_number = model.phoneNumber;
        newUser.serial_number = '123';
        newUser.create_date = new Date(new Date().toISOString());
        newUser.user_type = model.userType;

        //判斷是企業還是個人
        switch (model.userType) {
            case 'B':
                if (model.store == null) {
                    resultDto = new RespBody<string>({
                        isSuccess: false,
                        code: HttpCodeEnum.Status400BadRequest,
                        message: '店家資訊不可為空'
                    });
                    return resultDto;
                }
                const newStore = new OrganizationStoreEntity();
                newStore.store_name = model.store.storeName;
                newStore.business_time = JSON.stringify(model.store.businessTime);
                newStore.email = model.store.storeEmail;
                newStore.phone_number = model.store.storePhoneNumber;
                newStore.store_address = model.store.storeAddress;
                newStore.website = model.store.website;
                await this.organizationStoreRepo.save(newStore);
                newUser.b_store_id = newStore._id;
                break;
            case 'P':
                if (model.isApplyTeacher) {
                    if (model.teacherInfo == null) {
                        resultDto = new RespBody<string>({
                            isSuccess: false,
                            code: HttpCodeEnum.Status400BadRequest,
                            message: '老師資訊不可為空'
                        });
                        return resultDto;
                    }
                    newUser.is_pass_teacher = true;
                    newUser.is_pass_personal = false;
                    const newTeacher = new TeacherDetailEntity();
                    newTeacher.skill = model.teacherInfo.skill;
                    newTeacher.title = model.teacherInfo.title;
                    newTeacher.experiences = model.teacherInfo.experiences;
                    newTeacher.business_time = JSON.stringify(model.teacherInfo.businessTime);
                    await this.teacherDetailRepo.save(newTeacher);
                    newUser.teacher_id = newTeacher._id;

                }
                break;
        }

        await this.accountRepo.save(newUser);
        resultDto = new RespBody<string>({
            isSuccess: true,
            code: HttpCodeEnum.Status200OK,
            message: '註冊成功'
        });

        return resultDto;

    }

    // RefreshToken產生新的JWT Token
    async refreshToken(token: string): Promise<RespBody<GetUserRespDto>> {
        let resultDto: RespBody<GetUserRespDto>;
        const refreshToken = await this.refreshTokensRepo.findOne(
            {
                where: {
                    token: token
                }
            }
        );
        if (!refreshToken) {
            resultDto = new RespBody<GetUserRespDto>({
                isSuccess: false,
                code: HttpCodeEnum.Status400BadRequest,
                message: 'Refresh Token不存在'
            });
            return resultDto;
        }
        //檢查有效期限
        if (refreshToken.expires < new Date()) {
            resultDto = new RespBody<GetUserRespDto>({
                isSuccess: false,
                code: HttpCodeEnum.Status400BadRequest,
                message: 'Refresh Token已過期'
            });
            return resultDto;
        }
        //檢查是否有此會員
        const user = await this.accountRepo.findOne(
            {
                where: {
                    _id: refreshToken.member_id
                }
            }
        );
        if (!user) {
            resultDto = new RespBody<GetUserRespDto>({
                isSuccess: false,
                code: HttpCodeEnum.Status400BadRequest,
                message: '會員不存在'
            });
            return resultDto;
        }
        //產生新的JWT Token
        const tokenInfo: MemberTokenInfo = {
            id: user._id,
            // ... any other fields as required
        };
        const jwtToken = this.jwtUtility.generateJwtToken(tokenInfo);
        //寫入redis key
        const sprintf = require('sprintf-js').sprintf;
        const redisKeyMemberToken = sprintf(REDIS_KEY_MEMBER, user._id);
        const client = RedisModule.redisClient;
        await client.set(redisKeyMemberToken, jwtToken);

        //把Refresh Token寫入資料庫,刪除之前的Refresh Token
        const oldRefreshTokens = await this.refreshTokensRepo.find({ where: { member_id: user._id } })
        if (oldRefreshTokens.length > 0) {
            this.refreshTokensRepo.remove(oldRefreshTokens);
        }
        //填寫好Refresh Token Entity
        const newRefreshToken = this.jwtUtility.generateRefreshToken();
        let insertRefreshToken = new RefreshTokensEntity();
        insertRefreshToken.member_id = user._id;
        insertRefreshToken.token = newRefreshToken.token;
        insertRefreshToken.created_at = newRefreshToken.createdAt;
        insertRefreshToken.expires = newRefreshToken.expires;
        await this.refreshTokensRepo.insert(insertRefreshToken);

        resultDto = new RespBody<GetUserRespDto>({
            isSuccess: true,
            code: HttpCodeEnum.Status200OK,
            data: {
                account: user.account,
                name: user.name,
                email: user.email,
                phoneNumber: user.phone_number,
                imgUrl: user.img_url,
                serialNumber: user.serial_number,
                createDate: user.create_date,
                lastLoginDate: user.last_login_date,
                jwtToken: jwtToken,
                referenceToken: newRefreshToken.token
            }
        });
        return resultDto;

    }



}
