import { Injectable } from '@nestjs/common';
import { CreateRankDto } from './dto/create-rank.dto';
import { Ranks } from './entities/rank.entity';

@Injectable()
export class RanksService {
  async create(createRankDto: CreateRankDto): Promise<Ranks | null> {
    const rank = new Ranks();
    rank.name = createRankDto.name;

    await rank.save();

    return await Ranks.findOne({
      where: { id: rank.id },
    });
  }

  async findAll(): Promise<Ranks[]> {
    return await Ranks.find();
  }

  async findOne(id: number): Promise<Ranks | null> {
    const rank = await Ranks.findOneBy({ id });

    return rank;
  }

  async update(
    id: number,
    createRankDto: CreateRankDto,
  ): Promise<Ranks | null> {
    const rank = await Ranks.findOne({ where: { id: id } });

    if (rank !== null) {
      rank.name = createRankDto.name;
      await rank.save();

      return Ranks.findOne({ where: { id: id } });
    }

    return null;
  }

  async remove(id: number): Promise<Ranks | null> {
    const rank = await Ranks.findOne({ where: { id: id } });

    if (rank !== null) {
      await rank.remove();
      return rank;
    }

    return null;
  }
}
