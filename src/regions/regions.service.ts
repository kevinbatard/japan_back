import { Injectable } from '@nestjs/common';
import { CreateRegionDto } from './dto/create-region.dto';
import { GetRegionDto } from './dto/getRegion.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { Regions } from './entities/region.entity';

@Injectable()
export class RegionsService {
  async create(createRegionDto: CreateRegionDto): Promise<Regions | null> {
    const newRegion = new Regions();
    newRegion.name = createRegionDto.name;
    newRegion.description = createRegionDto.description;

    await newRegion.save();
    return await Regions.findOne({ where: { id: newRegion.id } });
  }

  async findOneByName(getRegionDto: GetRegionDto): Promise<Regions | null> {
    const region = Regions.findOne({ where: { name: getRegionDto.name } });
    if (region !== null) return region;

    return null;
  }
  async findAll(): Promise<Regions[]> {
    return await Regions.find();
  }

  async findOneById(id: number): Promise<Regions | null> {
    const region = await Regions.findOne({
      where: { id: id },
    });
    if (region) return region;

    return null;
  }

  async update(
    id: number,
    updateRegionDto: UpdateRegionDto,
  ): Promise<Regions | null> {
    const region = await Regions.findOne({ where: { id: id } });

    if (region !== null) {
      region.description = updateRegionDto.description;
      await region.save();

      return await Regions.findOne({ where: { id: id } });
    }

    return null;
  }

  async remove(id: number): Promise<Regions | null> {
    const region = await Regions.findOne({ where: { id: id } });

    if (region !== null) {
      await region.remove();
      return region;
    }

    return null;
  }
}
