import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Interests extends BaseEntity {
  @ApiProperty()
  @PrimaryColumn({ type: 'integer' })
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
}
