import { ApiProperty } from '@nestjs/swagger';
import { Category } from 'src/categories/entities/category.entity';
import { Regions } from 'src/regions/entities/region.entity';
import { Users } from 'src/users/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
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
  adress: string;

  @ApiProperty()
  @Column({ type: 'numeric' })
  latitude: number;

  @ApiProperty()
  @Column({ type: 'numeric' })
  longitude: number;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @ApiProperty()
  @Column({ type: 'timestamptz', default: null, nullable: true })
  updated_at: Date;

  @ApiProperty()
  @Column({ type: 'timestamptz', default: null, nullable: true })
  deleted_at: Date;

  @ManyToOne(() => Regions, (region) => region.interests)
  region: Regions;

  @ManyToOne(() => Users, (user) => user.interests)
  user: Users;

  @OneToOne(() => Category)
  @JoinColumn()
  category: Category;
}
