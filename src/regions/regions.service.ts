import { Injectable } from '@nestjs/common';
import { IsNull } from 'typeorm';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { Regions } from './entities/region.entity';

@Injectable()
export class RegionsService {
  create(createProvinceDto: CreateRegionDto) {
    return 'This action adds a new province';
  }

  findAll() {
    return `This action returns all provinces`;
  }

  async findOneById(id: number): Promise<Regions | null> {
    return await Regions.findOne({
      where: { id: id },
    });
  }

  update(id: number, updateProvinceDto: UpdateRegionDto) {
    return `This action updates a #${id} province`;
  }

  remove(id: number) {
    return `This action removes a #${id} province`;
  }
}
