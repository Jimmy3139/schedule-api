// import { AccountEntity } from "src/modules/entities/account.entity";
// import { IntersectionType, PartialType, PickType } from '@nestjs/mapped-types';


export class GetUserRespDto {
    account: string;
    name: string;
    email: string;
    phoneNumber: string;
    imgUrl: string;
    serialNumber: string;
    createDate: Date;
    lastLoginDate: Date;
    jwtToken?: string;
    referenceToken?: string;
    isPassTeacher?: boolean | 0;
    isPassPersonal?: boolean | 0;
    userType?: string;
    teacherInfo?: TeacherInfoDto;
    storeInfo?: StoreInfoDto


}


export class TeacherInfoDto {
    title: string;          // 頭銜-必填
    skill?: string;         // 介紹
    experiences?: string;   // 簡歷
    businessTime: WeeklySchedule;  // 營業時間

}

export class StoreInfoDto {
    level: number;
    storeName: string;
    phone: string;
    email: string;
    address: string;
    website: string;
    businessTime: WeeklySchedule;

}