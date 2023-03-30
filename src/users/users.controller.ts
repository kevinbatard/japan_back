import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { ApiResponse } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiResponse({ status: 201, description: 'Utilisateur enregistré !' })
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    const mailExist = await this.usersService.findOneByMail(
      createUserDto.email,
    ); /* Compare l'email de l'utilisateur, existe-t-il déjà ? */

    if (mailExist) {
      throw new ConflictException('Ce mail est déjà enregistré.'); /* Nest */
    }

    const pseudoExist = await this.usersService.findOneByPseudo(
      createUserDto.pseudo,
    );

    if (pseudoExist)
      throw new ConflictException('Ce pseudo est déjà enregistré.');

    createUserDto.password = await bcrypt.hash(
      createUserDto.password,
      10,
    ); /* Crypte le mot de passe */

    const data = await this.usersService.create(
      createUserDto,
    ); /* Créé le nouvel utilisateur */
    return {
      StatusCode: 201,
      message: `${createUserDto.pseudo} a bien été enregistré` /* Concatenation d'une variable dans un string littéral pour écrire le pseudo */,
      data: data /* Renvoie la data sans le mot de passe évidemment */,
    };
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
