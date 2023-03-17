import { Injectable } from '@nestjs/common';
import { IsNull } from 'typeorm';
import { CreateProvinceDto } from './dto/create-province.dto';
import { UpdateProvinceDto } from './dto/update-province.dto';
import { Provinces } from './entities/province.entity';

@Injectable()
export class ProvincesService {
  create(createProvinceDto: CreateProvinceDto) {
    return 'This action adds a new province';
  }

  findAll() {
    return `This action returns all provinces`;
  }

  async findOneById(id: number): Promise<Provinces | null> {
    return await Provinces.findOne({
      where: { id: id },
    });
  }

  update(id: number, updateProvinceDto: UpdateProvinceDto) {
    return `This action updates a #${id} province`;
  }

  remove(id: number) {
    return `This action removes a #${id} province`;
  }
}
