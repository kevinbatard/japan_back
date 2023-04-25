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
  Req,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Users } from 'src/users/entities/user.entity';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 201, description: 'Nouvelle categorie posté' })
  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Req() req: { user: Users },
  ) {
    const userData = req.user;

    if (userData.access_lvl < 2)
      throw new UnauthorizedException('Accès non autorisé');

    const newCategory = await this.categoriesService.create(createCategoryDto);

    return {
      StatusCode: 201,
      Message: 'Nouvelle categorie posté',
      data: newCategory,
    };
  }

  @ApiResponse({ status: 200, description: 'Voici toutes les catégories.' })
  @Get()
  async findAll() {
    const allCategories = await this.categoriesService.findAll();

    return {
      StatusCode: 200,
      Message: 'Voici toutes les catégories',
      data: allCategories,
    };
  }

  @ApiResponse({ status: 200, description: 'Catégorie modifiée' })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @Bind(Param('id', new ParseIntPipe()))
  async update(
    @Param('id') id: string,
    @Body() createCategoryDto: CreateCategoryDto,
    @Req() req: { user: Users },
  ) {
    const userData = req.user;

    if (userData.access_lvl < 2)
      throw new UnauthorizedException('Accès non autorisé');

    const updateCategory = await this.categoriesService.update(
      +id,
      createCategoryDto,
    );

    if (updateCategory === null)
      throw new NotFoundException('Catégorie introuvalbe');

    return {
      StatusCode: 200,
      Message: 'Catégorie modifié',
      Data: updateCategory,
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Catégorie supprimée' })
  @Bind(Param('id', new ParseIntPipe()))
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: { user: Users }) {
    const userData = req.user;

    if (userData.access_lvl < 2)
      throw new UnauthorizedException('Accès non autorisé');

    const deleteCategory = await this.categoriesService.remove(+id);

    if (deleteCategory === null) throw new NotFoundException();

    return {
      statusCode: 200,
      Message: 'Catégorie supprimée',
      data: deleteCategory,
    };
  }
}
