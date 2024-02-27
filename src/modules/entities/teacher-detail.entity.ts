import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { AccountEntity } from './account.entity';
/**
 * @description 帳號詳細資料
 * @class AccountDetailEntity
 * @implements {TeacherDetailEntity}
 */
@Entity('teacher_detail')
export class TeacherDetailEntity {

  @PrimaryGeneratedColumn('increment', {
    type: 'bigint'
  })
  _id: bigint;

  @Column({ type: 'text', nullable: true })
  skill: string | null;

  @Column({ type: 'text', nullable: true })
  experiences: string | null;

  @Column({ type: 'text', nullable: true })
  title: string | null;

  @Column({ type: 'text' })
  business_time: string;

  @OneToOne(() => AccountEntity, account => account.teacherDetail)
  account: AccountEntity;
}
