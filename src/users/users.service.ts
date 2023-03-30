import { ConflictException, Injectable } from '@nestjs/common';
import { Regions } from 'src/regions/entities/region.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from './entities/user.entity';

@Injectable()
export class UsersService {
  async findOneByMail(email: string) {
    return await Users.findOneBy({
      email: email,
    }); /* Comparer l'email communiqué par l'utilisateur... */
  }

  async create(createUserDto: CreateUserDto) {
    const user = await Users.create({
      ...createUserDto,
    }).save(); /*... S'il n'existe pas déjà (Controller), créer un nouvel utilisateur */
    return user;
  }

  async findOneByPseudo(pseudo: string): Promise<Users | null> {
    return await Users.findOneBy({ pseudo: pseudo });
  }

  async update(
    updateUserDto: UpdateUserDto,
    userData: Users,
  ): Promise<Users | null> {
    const visit = await Users.findOne({
      relations: { visited_regions: true },
      where: { id: userData.id },
    });
    const region = await Regions.findOne({
      where: { id: updateUserDto.region_id },
    });

    if (region !== null && visit !== null) {
      visit.visited_regions.push(region);

      await visit.save();

      return await Users.findOne({
        relations: { visited_regions: true },
        where: { id: userData.id },
      });
    }

    return null;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
