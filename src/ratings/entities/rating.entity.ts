import { ApiProperty } from '@nestjs/swagger';
import { Provinces } from 'src/provinces/entities/province.entity';
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

  @ManyToOne(() => Provinces, (province) => province.ratings)
  province: Provinces;

  @ManyToOne(() => Users, (user) => user.ratings)
  user: Users;
}
