import { ApiProperty } from '@nestjs/swagger';
import { Comments } from 'src/comments/entities/comment.entity';
import { Interests } from 'src/interests/entities/interest.entity';
import { Ratings } from 'src/ratings/entities/rating.entity';
import { Users } from 'src/users/entities/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['name'])
export class Regions extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @ApiProperty()
  @Column({ type: 'varchar', name: 'name' })
  name: string;

  @ApiProperty()
  @Column({ type: 'varchar' })
  description: string;

  @OneToMany(() => Comments, (comments) => comments.region)
  comments: Comments[];

  @OneToMany(() => Ratings, (ratings) => ratings.region)
  ratings: Ratings[];

  @OneToMany(() => Interests, (interests) => interests.region)
  interests: Interests[];

  @ManyToMany(() => Users, (user) => user.regions)
  users: Users[];
}
