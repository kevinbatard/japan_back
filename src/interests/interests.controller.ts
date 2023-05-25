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
import { RegionsService } from 'src/regions/regions.service';

@Controller('interests')
export class InterestsController {
  constructor(
    private readonly interestsService: InterestsService,
    private readonly regionsService: RegionsService,
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

    const newInterest = await this.interestsService.create(
      createInterestDto,
      userData,
    );

    if (newInterest === null)
      throw new NotFoundException("Cette région n'existe pas");

    return {
      StatusCode: 201,
      Message: `Point d'intéret ajouté`,
      data: newInterest,
    };
  }

  @ApiResponse({
    status: 200,
    description: "Voici tout les points d'intérets de la region.",
  })
  @Get('region/:id')
  @Bind(Param('id', new ParseIntPipe()))
  async find(@Param('id') id: string) {
    const isExist = await this.regionsService.findOneById(+id);
    if (!isExist) throw new NotFoundException('Région introuvable');

    const interests = await this.interestsService.findAllInterests(+id);

    return {
      statusCode: 200,
      message: `Voici tout les points d'intéret de la region ${isExist.name}.`,
      data: interests,
    };
  }

  @ApiResponse({
    status: 200,
    description: "Vous avez modifié le point d'intéret",
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

    if (interestUpdated === null)
      throw new NotFoundException("Ce point d'intéret n'existe pas");

    return {
      StatusCode: 200,
      message: `Vous avez modifié le point d'intéret n°${id}`,
      data: interestUpdated,
    };
  }

  @ApiResponse({
    status: 200,
    description: `Point d'intéret supprimé`,
  })
  @UseGuards(JwtAuthGuard)
  @Bind(Param('id', new ParseIntPipe()))
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    const userData = req.user;

    const isYourInterest = await this.interestsService.findOne(+id);
    if (!isYourInterest)
      throw new NotFoundException("Ce point d'intéret n'existe pas.");
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
      StatusCode: 200,
      message: `Point d'intéret n°${id} supprimé`,
      data: interestDeleted,
    };
  }
}
