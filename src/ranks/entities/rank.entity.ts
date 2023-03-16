import { ApiProperty } from '@nestjs/swagger';
import { Users } from 'src/users/entities/user.entity';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class Ranks extends BaseEntity {
  @ApiProperty()
  @PrimaryColumn({ type: 'integer' })
  id: number;

  @ApiProperty()
  @Column({ type: 'varchar' })
  name: string;

  @ManyToOne(() => Users, (user) => user.ranks)
  user: Users;
}
