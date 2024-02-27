import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    ManyToOne
} from 'typeorm';
import { TeacherDetailEntity } from './teacher-detail.entity';
import { OrganizationStoreEntity } from './organization-store.entity';

@Entity('accounts')
export class AccountEntity {
    @PrimaryGeneratedColumn('increment', {
        type: 'bigint'
    })
    _id: bigint;

    @Column({
        type: 'varchar',
        length: 30,
        comment: '帳號'
    })
    account: string;

    @Column({
        type: 'varchar',
        length: 100,
        comment: '密碼'
    })
    password: string;

    @Column({
        type: 'varchar',
        length: 10,
    })
    name: string;

    @Column({
        type: 'varchar',
        length: 30,
    })
    email: string;

    @Column({
        type: 'varchar',
        length: 12,
    })
    phone_number: string;

    @Column({
        type: 'text',
        nullable: true,  // 允许 NULL 值
        comment: '頭像照片'
    })
    img_url: string | null;  // 类型应包括 null

    @Column({
        type: 'datetime',
        precision: 6,
        default: () => 'CURRENT_TIMESTAMP(6)',  // 默认值为当前时间戳
        comment: '註冊時間'
    })
    create_date: Date;

    @Column({
        type: 'datetime',
        nullable: true,  // 允许 NULL 值
        comment: '最後登入時間'
    })
    last_login_date: Date | null;  // 类型应包括 null

    @Column({
        type: 'varchar',
        length: 1,
        comment: '用戶分類 B/P'
    })
    user_type: string;

    @Column({
        type: 'datetime',
        nullable: true,  // 允许 NULL 值
    })
    authorization_deadline: Date | null;  // 类型应包括 null

    @Column({
        type: 'tinyint',
        default: 0,  // 默认值为 0
    })
    is_pass_personal: boolean;

    @Column({
        type: 'tinyint',
        default: 0,  // 默认值为 0
    })
    is_pass_teacher: boolean;

    @Column({
        type: 'varchar',
        length: 10,
    })
    nick_name: string;

    @Column({
        type: 'varchar',
        length: 10,
        nullable: true,
    })
    serial_number: string | null;

    @Column({
        type: 'bigint',
        nullable: true,  // 允许 NULL 值
        comment: '帳號指向的店面Id'
    })
    b_store_id: bigint | null;  // 类型应包括 null

    @Column({
        type: 'bigint',
        nullable: true,  // 允许 NULL 值
    })
    teacher_id: bigint | null;  // 类型应包括 null

    @OneToOne(() => TeacherDetailEntity, teacherDetail => teacherDetail.account, { eager: true, nullable: true })
    @JoinColumn({ name: 'teacher_id' })
    teacherDetail: TeacherDetailEntity | null;


    @OneToOne(() => OrganizationStoreEntity, organizationStore => organizationStore.account, { eager: true, nullable: true })
    @JoinColumn({ name: 'b_store_id' })
    organizationStore: OrganizationStoreEntity | null;


}
