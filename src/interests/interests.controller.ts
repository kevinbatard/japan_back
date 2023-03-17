import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Bind,
  ParseIntPipe,
  NotFoundException,
  UnauthorizedException,
  Request,
} from '@nestjs/common';
import { InterestsService } from './interests.service';
import { CreateInterestDto } from './dto/create-interest.dto';
import { UpdateInterestDto } from './dto/update-interest.dto';
import { ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ProvincesService } from 'src/provinces/provinces.service';

@Controller('interests')
export class InterestsController {
  constructor(
    private readonly interestsService: InterestsService,
    private readonly provincesService: ProvincesService,
  ) {}

  @ApiResponse({
    status: 201,
    description: `Point d'intéret ajouté`,
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createInterestDto: CreateInterestDto,
    @Request() req: any,
  ) {
    const userData = req.user;
    return this.interestsService.create(createInterestDto, userData);
  }

  @ApiResponse({
    status: 200,
    description: "Voici tout les points d'intérets de la province ${id}.",
  })
  @Get('province/:id')
  @Bind(Param('id', new ParseIntPipe()))
  async find(@Param('id') id: string) {
    const isExist = await this.provincesService.findOneById(+id);
    if (!isExist) throw new NotFoundException();
    return {
      message: `Voici tout les commentaire de la province ${isExist.name}.`,
      data: await this.interestsService.findAllInterests(+id),
    };
  }

  @ApiResponse({
    status: 201,
    description: "Vous avez modifié le point d'intéret n°${id}",
  })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @Bind(Param('id', new ParseIntPipe()))
  async update(
    @Param('id') id: string,
    @Body() updateInterestDto: UpdateInterestDto,
  ) {
    const interestUpdated = await this.interestsService.update(
      +id,
      updateInterestDto,
    );

    if (interestUpdated === null) throw new NotFoundException();

    return {
      message: `Vous avez modifié le point d'intéret n°${id}`,
      data: interestUpdated,
    };
  }

  @ApiResponse({
    status: 201,
    description: `Point d'intéret supprimé`,
  })
  @UseGuards(JwtAuthGuard)
  @Bind(Param('id', new ParseIntPipe()))
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    const userData = req.user;

    const isYourInterest = await this.interestsService.findOne(+id);

    if (
      userData.pseudo !== isYourInterest?.user.pseudo &&
      userData.access_lvl < 3
    )
      throw new UnauthorizedException(
        "Ce point d'intéret ne vous appartient pas",
      );

    const interestDeleted = await this.interestsService.remove(+id);

    if (interestDeleted === null) throw new NotFoundException();

    return {
      message: `Point d'intéret n°${id} supprimé`,
      data: interestDeleted,
    };
  }
}
