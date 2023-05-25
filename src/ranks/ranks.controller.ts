import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  UnauthorizedException,
  Bind,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { RanksService } from './ranks.service';
import { CreateRankDto } from './dto/create-rank.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Users } from 'src/users/entities/user.entity';

@ApiTags('Ranks')
@Controller('ranks')
export class RanksController {
  constructor(private readonly ranksService: RanksService) {}

  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 201, description: 'Nouveau rang créée' })
  @Post()
  async create(
    @Body() createRankDto: CreateRankDto,
    @Request() req: { user: Users },
  ) {
    const userData = req.user;
    if (userData.access_lvl < 2)
      throw new UnauthorizedException('Accès non autorisé');

    const newRank = await this.ranksService.create(createRankDto);

    return {
      statusCode: 201,
      message: 'Nouveau rang ajouté',
      data: newRank,
    };
  }

  @ApiResponse({ status: 200, description: 'Voici tout les rangs' })
  @Get()
  async findAll() {
    const allRanks = await this.ranksService.findAll();

    return {
      StatusCode: 200,
      Message: 'Voici tout les rangs',
      data: allRanks,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const rank = await this.ranksService.findOne(+id);
    return {
      StatusCode: 200,
      Message: `Rang ${rank?.name}`,
      Data: rank,
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Rang modifié' })
  @Patch(':id')
  @Bind(Param('id', new ParseIntPipe()))
  async update(
    @Param('id') id: string,
    @Body() createRankDto: CreateRankDto,
    @Request() req: { user: Users },
  ) {
    const userData = req.user;
    if (userData.access_lvl < 2)
      throw new UnauthorizedException('Accès non autorisé');

    const updateRank = await this.ranksService.update(+id, createRankDto);

    if (updateRank === null) throw new NotFoundException();

    return {
      StatusCode: 200,
      Message: 'Rang modifié',
      data: updateRank,
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Rang supprimé' })
  @Delete(':id')
  @Bind(Param('id', new ParseIntPipe()))
  async remove(@Param('id') id: string, @Request() req: { user: Users }) {
    const userData = req.user;

    if (userData.access_lvl < 2)
      throw new UnauthorizedException('Accès non autorisé');

    const deleteRank = await this.ranksService.remove(+id);

    if (deleteRank === null) throw new NotFoundException();

    return { statusCode: 200, Message: 'Rang supprimé', data: deleteRank };
  }
}
