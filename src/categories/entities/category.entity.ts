import { ApiProperty } from '@nestjs/swagger';
import { Interests } from 'src/interests/entities/interest.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Category extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @OneToMany(() => Interests, (interest) => interest.category)
  interests: Interests[];
}
