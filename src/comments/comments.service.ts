import { Injectable } from '@nestjs/common';
import { Regions } from 'src/regions/entities/region.entity';
import { Users } from 'src/users/entities/user.entity';
import { IsNull } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comments } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  async create(
    createCommentDto: CreateCommentDto,
    userData: Users,
  ): Promise<Comments | null> {
    const region = await Regions.findOneBy({
      id: createCommentDto.region_id,
    });
    if (region !== null) {
      const comment = new Comments();
      comment.content = createCommentDto.content;
      comment.region = region;
      comment.user = userData;

      await comment.save();

      return await Comments.findOne({
        relations: { region: true, user: true },
        select: {
          id: true,
          content: true,
          created_at: true,
          region: { id: true, name: true },
          user: { id: true, pseudo: true },
        },
        where: { id: comment.id },
      });
    }
    return null;
  }

  async findAllComments(id: number): Promise<Comments[] | null> {
    return await Comments.find({
      relations: { user: true, region: true },
      where: { region: { id: id }, deleted_at: IsNull() },
      select: {
        id: true,
        content: true,
        created_at: true,
        updated_at: true,
        user: { pseudo: true },
      },
      order: { created_at: 'DESC' },
    });
  }

  async update(
    id: number,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comments | null> {
    const newComment = await Comments.findOne({
      where: { id: id, deleted_at: IsNull() },
    });

    if (newComment !== null) {
      newComment.content = updateCommentDto.content;
      newComment.updated_at = new Date();
      await newComment.save();

      return await Comments.findOne({
        relations: { user: true },
        where: { id: id, deleted_at: IsNull() },
        select: {
          id: true,
          content: true,
          created_at: true,
          updated_at: true,
          user: { pseudo: true },
        },
      });
    }
    return null;
  }

  async findOne(id: number): Promise<Comments | null> {
    const comment = await Comments.findOne({
      relations: { user: true },
      where: { id: id, deleted_at: IsNull() },
      select: {
        user: { pseudo: true },
        id: true,
        content: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (comment !== null) return comment;

    return null;
  }

  async remove(id: number): Promise<Comments | null> {
    const deleteComment = await Comments.findOne({
      where: { id: id, deleted_at: IsNull() },
    });

    if (deleteComment !== null) {
      deleteComment.deleted_at = new Date();

      await deleteComment?.save();

      return await Comments.findOne({
        relations: { user: true },
        where: { id: id },
        select: {
          id: true,
          content: true,
          created_at: true,
          updated_at: true,
          deleted_at: true,
          user: { pseudo: true },
        },
      });
    }
    return null;
  }
}
