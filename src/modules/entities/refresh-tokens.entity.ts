import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('refresh_tokens')
export class RefreshTokensEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint'
  })
  _id: bigint; 

  @Column('bigint', {
    transformer: {
      to: (value: bigint) => value.toString(),
      from: (value: string) => BigInt(value),
    },
  })
  member_id: bigint;

  @Column({
    type: 'varchar',
    length: 255,
    comment: 'Token',
  })
  token: string;

  @Column({
    type: 'datetime',
    comment: 'Expires',
  })
  expires?: Date;

  @Column({
    type: 'datetime',
    comment: 'Created At',
  })
  created_at?: Date;
}
