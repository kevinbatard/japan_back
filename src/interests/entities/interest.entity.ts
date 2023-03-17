import { ApiProperty } from '@nestjs/swagger';
import { Provinces } from 'src/provinces/entities/province.entity';
import { Users } from 'src/users/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Interests extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @ApiProperty()
  @Column({ type: 'varchar' })
  name: string;

  @ApiProperty()
  @Column({ type: 'varchar' })
  category: string;

  @ApiProperty()
  @Column({ type: 'varchar' })
  adress: string;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @ApiProperty()
  @Column({ type: 'timestamptz', default: null, nullable: true })
  updated_at: Date;

  @ApiProperty()
  @Column({ type: 'timestamptz', default: null, nullable: true })
  deleted_at: Date;

  @ManyToOne(() => Provinces, (province) => province.interests)
  province: Provinces;

  @ManyToOne(() => Users, (user) => user.interests)
  user: Users;
}
