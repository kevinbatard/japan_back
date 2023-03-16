import { Injectable } from '@nestjs/common';
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

  findAll() {
    return `This action returns all users`;
  }

  async findOneByPseudo(pseudo: string): Promise<Users | null> {
    return await Users.findOneBy({ pseudo: pseudo });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
