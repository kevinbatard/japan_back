import { Injectable } from '@nestjs/common';
import { Provinces } from 'src/provinces/entities/province.entity';
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
    const province = await Provinces.findOneBy({
      id: createInterestDto.province_id,
    });
    if (province !== null) {
      const newInterest = new Interests();
      newInterest.name = createInterestDto.name;
      newInterest.category = createInterestDto.category;
      newInterest.adress = createInterestDto.adress;
      newInterest.province = province;
      newInterest.user = userData;

      await newInterest.save();
      return await Interests.findOne({
        relations: { province: true },
        select: {
          id: true,
          name: true,
          category: true,
          adress: true,
          province: { name: true },
        },
        where: { id: newInterest.id },
      });
    }
    return null;
  }

  async findAllInterests(id: number): Promise<Interests[] | null> {
    return await Interests.find({
      relations: { province: true },
      where: { province: { id: id }, deleted_at: IsNull() },
      select: {
        id: true,
        name: true,
        created_at: true,
        updated_at: true,
      },
      order: { created_at: 'DESC' },
    });
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
      if (updateInterestDto.category)
        newInterest.category = updateInterestDto.category;
      if (updateInterestDto.adress)
        newInterest.adress = updateInterestDto.adress;
      newInterest.updated_at = new Date();
      await newInterest.save();

      return await Interests.findOne({
        relations: { province: true },
        where: { id: id, deleted_at: IsNull() },
        select: {
          id: true,
          name: true,
          category: true,
          adress: true,
          created_at: true,
          updated_at: true,
          province: { name: true },
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
        category: true,
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
        relations: { user: true },
        where: { id: id },
        select: {
          id: true,
          name: true,
          category: true,
          adress: true,
          created_at: true,
          updated_at: true,
          deleted_at: true,
          user: { pseudo: true },
        },
      });
    }
    return null;
  }
}
