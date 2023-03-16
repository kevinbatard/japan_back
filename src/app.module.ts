import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { RanksModule } from './ranks/ranks.module';
import { CommentsModule } from './comments/comments.module';
import { ProvincesModule } from './provinces/provinces.module';
import { RatingsModule } from './ratings/ratings.module';
import { InterestsModule } from './interests/interests.module';
import { Comments } from './comments/entities/comment.entity';
import { Interests } from './interests/entities/interest.entity';
import { Provinces } from './provinces/entities/province.entity';
import { Ranks } from './ranks/entities/rank.entity';
import { Ratings } from './ratings/entities/rating.entity';
import { Users } from './users/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT!),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [Comments, Interests, Provinces, Ranks, Ratings, Users],
      synchronize: true,
    }),
    UsersModule,
    RanksModule,
    CommentsModule,
    ProvincesModule,
    RatingsModule,
    InterestsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
