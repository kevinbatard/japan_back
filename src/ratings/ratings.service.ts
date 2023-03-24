import { Injectable, NotFoundException } from '@nestjs/common';
import { Users } from 'src/users/entities/user.entity';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { Ratings } from './entities/rating.entity';

@Injectable()
export class RatingsService {
  async create(
    createRatingDto: CreateRatingDto,
    userData: Users,
  ): Promise<Ratings | null> {
    const rate = new Ratings();
    rate.rate = createRatingDto.rate;
    rate.region = createRatingDto.region_id;
    rate.user = userData;

    await rate.save();

    return await Ratings.findOne({
      where: { id: rate.id },
    });
  }

  async checkIfRated(
    createRatingDto: CreateRatingDto,
    userData: Users,
  ): Promise<Ratings | null> {
    const checkRates = await Ratings.findOne({
      relations: { user: true, region: true },
      where: {
        user: { id: userData.id },
        region: { id: createRatingDto.region_id.id },
      },
      select: {
        id: true,
        rate: true,
        user: { pseudo: true },
        region: { name: true },
      },
    });

    if (checkRates !== null) return checkRates;

    return null;
  }

  async findOne(id: number): Promise<Ratings | null> {
    const isExist = await Ratings.findOne({ where: { id: id } });

    if (isExist !== null) {
      return isExist;
    }

    return null;
  }

  async update(
    updateRatingDto: UpdateRatingDto,
    isYourRate: Ratings,
  ): Promise<Ratings | null> {
    if (isYourRate !== null) {
      isYourRate.rate = updateRatingDto.rate;
      await isYourRate.save();

      return await Ratings.findOne({ where: { id: isYourRate.id } });
    }

    return null;
  }

  async remove(id: number): Promise<Ratings | null> {
    const rate = await Ratings.findOne({ where: { id: id } });

    if (rate !== null) {
      await rate.remove();
      return rate;
    }

    return null;
  }
}
