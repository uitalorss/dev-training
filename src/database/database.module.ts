import 'dotenv/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Course } from 'src/courses/entity/courses.entity';
import { Tag } from 'src/courses/entity/tags.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: Number(configService.get('DB_PASS')),
          username: configService.get('DB_USER'),
          password: configService.get('DB_PASS'),
          database: configService.get('DB_NAME'),
          entities: [Course, Tag],
          synchronize: false,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
