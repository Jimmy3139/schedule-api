import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn
} from 'typeorm';
import { AccountEntity } from './account.entity';

@Entity('organization_store')
export class OrganizationStoreEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint'
  })
  _id: bigint;

  @Column({
    type: 'varchar',
    length: 10,
    comment: 'Organization Serial Number'
  })
  organization_serial_number: string;

  @Column({
    type: 'varchar',
    length: 10,
    comment: 'Store Name'
  })
  store_name: string;

  @Column({
    type: 'varchar',
    length: 30,
    nullable: true,  // 允许 NULL 值
    comment: 'Phone Number'
  })
  phone_number: string | null;  // 类型应包括 null

  @Column({
    type: 'varchar',
    length: 30,
    nullable: true,  // 允许 NULL 值
    comment: 'Email'
  })
  email: string | null;  // 类型应包括 null

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,  // 允许 NULL 值
    comment: 'Store Address'
  })
  store_address: string | null;  // 类型应包括 null

  @Column({
    type: 'text',
    nullable: true,  // 允许 NULL 值
    comment: '官網網址'
  })
  website: string | null;  // 类型应包括 null

  @Column({
    type: 'text',
    nullable: true,  // 允许 NULL 值
  })
  business_time: string | null;  // 类型应包括 null

  @Column({
    type: 'bigint',
    unsigned: true,  // 无符号
    default: 0,  // 默认值为 0
  })
  lv_0: bigint;

  @Column({
    type: 'int',
    default: 0,  // 默认值为 0
    comment: '層級 0 : 主帳(總店)  1: 子帳(分店)'
  })
  level: number;

  @OneToOne(() => AccountEntity, account => account.organizationStore,{nullable:true})
  account: AccountEntity|null;
}
