import { ApiProperty } from '@nestjs/swagger';
import { Regions } from 'src/regions/entities/region.entity';
import { Users } from 'src/users/entities/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Ratings extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @ApiProperty()
  @Column({ type: 'integer' })
  rate: number;

  @ManyToOne(() => Regions, (region) => region.ratings)
  @JoinColumn()
  region: Regions;

  @ManyToOne(() => Users, (user) => user.ratings)
  user: Users;
}
