import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDTO } from './dto/CreateCourseDTO';
import { UpdateCourseDTO } from './dto/UpdateCourseDTO';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}
  @Get()
  public async findAll(@Res() res) {
    const users = await this.coursesService.findAll();
    return res.status(200).json(users);
  }

  @Get(':id')
  public async findOne(@Param('id') id: string) {
    const course = await this.coursesService.findOne(id);
    return course;
  }

  @HttpCode(201)
  @Post()
  public async create(@Res() res, @Body() body: CreateCourseDTO) {
    await this.coursesService.create(body);
    return res.status(201).json({ message: 'Curso criado com sucesso' });
  }

  @HttpCode(204)
  @Put(':id')
  public async update(
    @Res() res,
    @Param('id') id: string,
    @Body() updateCourseDTO: UpdateCourseDTO
  ) {
    await this.coursesService.update(id, updateCourseDTO);
    return res.status(204).send();
  }

  @Delete(':id')
  public async delete(@Res() res, @Param('id') id: string) {
    await this.coursesService.remove(id);
    return res.status(204).send();
  }
}
