import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Comments } from 'src/comments/entities/comment.entity';
import { Interests } from 'src/interests/entities/interest.entity';
import { Regions } from 'src/regions/entities/region.entity';
import { Ranks } from 'src/ranks/entities/rank.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['pseudo', 'email'])
export class Users extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @ApiProperty()
  @Column({ type: 'varchar', name: 'pseudo' })
  pseudo: string;

  @ApiProperty()
  @Column({ type: 'varchar', name: 'email' })
  email: string;

  @ApiProperty()
  @Exclude()
  @Column({ type: 'varchar' })
  password: string;

  @ApiProperty()
  @Column({ type: 'integer', default: 1 })
  access_lvl: number;

  @ManyToOne(() => Ranks, (rank) => rank.user)
  ranks: Ranks;

  @OneToMany(() => Comments, (comment) => comment.user)
  comments: Comments[];

  @OneToMany(() => Interests, (interest) => interest.user)
  interests: Interests[];

  @ManyToMany(() => Regions, (region) => region.users_visitor)
  @JoinTable()
  visited_regions: Regions[];
}
