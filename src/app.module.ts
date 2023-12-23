import { Module } from '@nestjs/common';
import { CoursesModule } from './courses/courses.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    CoursesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
