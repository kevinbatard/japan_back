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
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Users } from './entities/user.entity';

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

  @ApiResponse({ status: 200, description: 'Visite enregistrée.' })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch('add')
  async addVisit(
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: { user: Users },
  ) {
    const userData = req.user;

    const newVisit = await this.usersService.moreVisit(updateUserDto, userData);

    if (newVisit === null)
      throw new ConflictException('Vous avez déjà visité cette région');

    return { StatusCode: 200, message: 'Visite enregistrée.', data: newVisit };
  }

  @ApiResponse({ status: 200, description: 'Visite retirée.' })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch('remove')
  async removeVisit(
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: { user: Users },
  ) {
    const userData = req.user;

    const removeVisit = await this.usersService.lessVisit(
      updateUserDto,
      userData,
    );
    console.log(removeVisit);

    if (removeVisit === null)
      throw new NotFoundException("Vous n'avez pas visité cette région");
    return { StatusCode: 200, message: 'Visite retirée.', data: removeVisit };
  }
}
