import { ApiProperty } from '@nestjs/swagger';
import { Regions } from 'src/regions/entities/region.entity';
import { Users } from 'src/users/entities/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Ratings extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @ApiProperty()
  @Column({ type: 'varchar' })
  rate: string;

  @ManyToOne(() => Regions, (region) => region.ratings)
  region: Regions;

  @ManyToOne(() => Users, (user) => user.ratings)
  user: Users;
}
