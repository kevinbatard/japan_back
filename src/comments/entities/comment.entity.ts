import { ApiProperty } from '@nestjs/swagger';
import { Provinces } from 'src/provinces/entities/province.entity';
import { Users } from 'src/users/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Comments extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @ApiProperty()
  @Column({ type: 'varchar' })
  content: string;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: 'timestamptz', default: null, nullable: true })
  updated_at: Date;

  @ApiProperty()
  @DeleteDateColumn({ type: 'timestamptz', default: null, nullable: true })
  deleted_at: Date;

  @ManyToOne(() => Provinces, (province) => province.comments)
  province: Provinces;

  @ManyToOne(() => Users, (user) => user.comments)
  user: Users;
}
