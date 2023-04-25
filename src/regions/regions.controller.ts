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
  UnauthorizedException,
  ConflictException,
  Bind,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { RegionsService } from './regions.service';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Users } from 'src/users/entities/user.entity';
import { GetRegionDto } from './dto/getRegion.dto';

@Controller('regions')
export class RegionsController {
  constructor(private readonly regionsService: RegionsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 201, description: 'Nouvelle région créée' })
  @Post()
  async create(
    @Body() createRegionDto: CreateRegionDto,
    @Req() req: { user: Users },
  ) {
    const userData = req.user;

    if (userData.access_lvl < 2)
      throw new UnauthorizedException('Accès non autorisé');

    const isExist = await this.regionsService.findOneByName(createRegionDto);

    if (isExist !== null)
      throw new ConflictException('Cette région existe déjà');

    const newRegion = await this.regionsService.create(createRegionDto);

    return {
      StatusCode: 201,
      Message: 'Nouvelle région créée.',
      Data: newRegion,
    };
  }

  @ApiResponse({ status: 200, description: 'Voici toute les régions.' })
  @Get()
  async findAll() {
    const allRegions = await this.regionsService.findAll();

    return {
      StatusCode: 200,
      Message: 'Voici toutes les régions',
      data: allRegions,
    };
  }

  @ApiResponse({ status: 200, description: 'Voica la région.' })
  @Post('get')
  async findOne(@Body() getRegionDto: GetRegionDto) {
    const region = await this.regionsService.findOneByName(getRegionDto);

    if (region === null) throw new NotFoundException('Region introuvalble');

    return {
      StatusCode: 200,
      Message: 'Voici la region demandée.',
      data: region,
    };
  }

  @ApiResponse({ status: 200, description: 'Description modifiée' })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @Bind(Param('id', new ParseIntPipe()))
  async update(
    @Param('id') id: string,
    @Body() updateRegionDto: UpdateRegionDto,
    @Req() req: { user: Users },
  ) {
    const userData = req.user;

    if (userData.access_lvl < 2)
      throw new UnauthorizedException('Accès non autorisé');

    const updateRegion = await this.regionsService.update(+id, updateRegionDto);

    if (updateRegion === null)
      throw new NotFoundException('Region introuvalbe');

    return {
      StatusCode: 200,
      Message: 'Description modifié',
      Data: updateRegion,
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Région supprimée' })
  @Bind(Param('id', new ParseIntPipe()))
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: { user: Users }) {
    const userData = req.user;

    if (userData.access_lvl < 2)
      throw new UnauthorizedException('Accès non autorisé');

    const deleteRegion = await this.regionsService.remove(+id);

    if (deleteRegion === null) throw new NotFoundException();

    return { statusCode: 200, Message: 'Région supprimé', data: deleteRegion };
  }
}
