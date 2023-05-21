import { Injectable } from '@nestjs/common';
import { Regions } from 'src/regions/entities/region.entity';
import { Users } from 'src/users/entities/user.entity';
import { IsNull } from 'typeorm';
import { CreateInterestDto } from './dto/create-interest.dto';
import { UpdateInterestDto } from './dto/update-interest.dto';
import { Interests } from './entities/interest.entity';

@Injectable()
export class InterestsService {
  async create(
    createInterestDto: CreateInterestDto,
    userData: Users,
  ): Promise<Interests | null> {
    const region = await Regions.findOneBy({
      id: createInterestDto.province_id,
    });
    if (region !== null) {
      const newInterest = new Interests();
      newInterest.name = createInterestDto.name;
      newInterest.adress = createInterestDto.adress;
      newInterest.region = region;
      newInterest.user = userData;
      newInterest.category = createInterestDto.category;
      newInterest.latitude = createInterestDto.latitude;
      newInterest.longitude = createInterestDto.longitude;

      await newInterest.save();
      return await Interests.findOne({
        relations: { region: true, user: true, category: true },
        select: {
          id: true,
          name: true,
          adress: true,
          latitude: true,
          longitude: true,
          category: { name: true },
          region: { name: true },
          user: { pseudo: true },
        },
        where: { id: newInterest.id },
      });
    }
    return null;
  }

  async findAllInterests(id: number): Promise<Interests[] | null> {
    const interestList = await Interests.find({
      relations: { region: true, category: true, user: true },
      where: { region: { id: id }, deleted_at: IsNull() },
      select: {
        id: true,
        name: true,
        adress: true,
        created_at: true,
        updated_at: true,
        latitude: true,
        longitude: true,
        category: { name: true },
        region: { name: true },
        user: { pseudo: true },
      },
      order: { created_at: 'DESC' },
    });
    if (interestList) return interestList;

    return null;
  }

  async update(
    id: number,
    updateInterestDto: UpdateInterestDto,
  ): Promise<Interests | null> {
    const newInterest = await Interests.findOne({
      where: { id: id, deleted_at: IsNull() },
    });

    if (newInterest !== null) {
      if (updateInterestDto.name) newInterest.name = updateInterestDto.name;
      if (updateInterestDto.adress)
        newInterest.adress = updateInterestDto.adress;
      if (updateInterestDto.latitude)
        newInterest.latitude = updateInterestDto.latitude;
      if (updateInterestDto.longitude)
        newInterest.longitude = updateInterestDto.longitude;
      if (updateInterestDto.category)
        newInterest.category = updateInterestDto.category;
      newInterest.updated_at = new Date();
      await newInterest.save();

      return await Interests.findOne({
        relations: { region: true, category: true, user: true },
        where: { id: id, deleted_at: IsNull() },
        select: {
          id: true,
          name: true,
          adress: true,
          latitude: true,
          longitude: true,
          created_at: true,
          updated_at: true,
          region: { name: true },
          category: { name: true },
          user: { pseudo: true },
        },
      });
    }
    return null;
  }

  async findOne(id: number): Promise<Interests | null> {
    const comment = await Interests.findOne({
      relations: { user: true },
      where: { id: id, deleted_at: IsNull() },
      select: {
        user: { pseudo: true },
        id: true,
        name: true,
        adress: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (comment !== null) return comment;

    return null;
  }

  async remove(id: number): Promise<Interests | null> {
    const deleteInterest = await Interests.findOne({
      where: { id: id, deleted_at: IsNull() },
    });

    if (deleteInterest !== null) {
      deleteInterest.deleted_at = new Date();

      await deleteInterest?.save();

      return await Interests.findOne({
        relations: { user: true, category: true },
        where: { id: id },
        select: {
          id: true,
          name: true,
          adress: true,
          created_at: true,
          updated_at: true,
          deleted_at: true,
          user: { pseudo: true },
          category: { name: true },
        },
      });
    }
    return null;
  }
}
