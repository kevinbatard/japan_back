import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  NotFoundException,
  Bind,
  ParseIntPipe,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Users } from 'src/users/entities/user.entity';

@ApiTags('Ratings')
@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 201, description: 'Note attribuée !' })
  @Post()
  async create(
    @Body() createRatingDto: CreateRatingDto,
    @Req() req: { user: Users },
  ) {
    const userData = req.user;

    const notAgain = await this.ratingsService.checkIfRated(
      createRatingDto,
      userData,
    );

    if (notAgain !== null)
      throw new ConflictException('Vous avez déjà noté cette région.');

    const newRate = await this.ratingsService.create(createRatingDto, userData);

    return {
      StatusCode: 201,
      Message: 'Note attribuée !',
      Data: newRate,
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Note Modifiée !' })
  @Patch(':id')
  @Bind(Param('id', new ParseIntPipe()))
  async update(
    @Param('id') id: string,
    @Body() updateRatingDto: UpdateRatingDto,
    @Req() req: { user: Users },
  ) {
    const userData = req.user;

    const isYourRate = await this.ratingsService.findOne(+id);
    if (isYourRate === null) throw new NotFoundException('Note introuvable.');

    if (userData.id !== isYourRate?.id)
      throw new UnauthorizedException('Cette note ne vous appartient pas.');
    const updateRate = await this.ratingsService.update(
      updateRatingDto,
      isYourRate,
    );

    if (updateRate === null) throw new NotFoundException('Note introuvable.');

    return {
      StatusCode: 200,
      Message: 'Note Modifiée !',
      Data: updateRate,
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Note Modifiée !' })
  @Delete(':id')
  @Bind(Param('id', new ParseIntPipe()))
  async remove(@Param('id') id: string, @Req() req: { user: Users }) {
    const userData = req.user;

    if (userData.access_lvl < 2)
      throw new UnauthorizedException('Accès non autorisé.');

    const deleteRate = await this.ratingsService.remove(+id);

    if (deleteRate === null) throw new NotFoundException('Note introuvable.');

    return {
      StatusCode: 200,
      Message: 'Note Supprimée !',
      Data: deleteRate,
    };
  }
}
