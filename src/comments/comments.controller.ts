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
  Bind,
  ParseIntPipe,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RegionsService } from 'src/regions/regions.service';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly provincesService: RegionsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 201, description: 'Commentaire posté' })
  @Post()
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @Request() req: any,
  ) {
    const userData = req.user;

    return this.commentsService.create(createCommentDto, userData);
  }

  @ApiResponse({
    status: 200,
    description: 'Voici tout les commentaire de la province ${id}.',
  })
  @Get('province/:id')
  @Bind(Param('id', new ParseIntPipe()))
  async find(@Param('id') id: string) {
    const isExist = await this.provincesService.findOneById(+id);
    if (!isExist) throw new NotFoundException();
    return {
      message: `Voici tout les commentaire de la province ${isExist.name}.`,
      data: await this.commentsService.findAllComments(+id),
    };
  }

  @ApiResponse({
    status: 201,
    description: 'Vous avez modifié le commentaire n°${id}',
  })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @Bind(Param('id', new ParseIntPipe()))
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    const commentUpdated = await this.commentsService.update(
      +id,
      updateCommentDto,
    );

    if (commentUpdated === null) throw new NotFoundException();

    return {
      message: `Vous avez modifié le commentaire n°${id}`,
      data: commentUpdated,
    };
  }

  @ApiResponse({
    status: 201,
    description: `Commentaire supprimé`,
  })
  @UseGuards(JwtAuthGuard)
  @Bind(Param('id', new ParseIntPipe()))
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    const userData = req.user;

    const isYourComment = await this.commentsService.findOne(+id);

    if (
      userData.pseudo !== isYourComment?.user.pseudo &&
      userData.access_lvl < 3
    )
      throw new UnauthorizedException('Ce commentaire ne vous appartient pas');

    const commentDeleted = await this.commentsService.remove(+id);

    if (commentDeleted === null) throw new NotFoundException();

    return {
      message: `Commentaire n°${id} supprimé`,
      data: commentDeleted,
    };
  }
}
