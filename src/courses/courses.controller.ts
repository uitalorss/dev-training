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
    findAll(@Res() res): string {
        const users = this.coursesService.findAll();
        return res.status(200).json(users);
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        const course = this.coursesService.findOne(id);
        return course;
    }

    @HttpCode(201)
    @Post()
    create(@Res() res, @Body() createCourseDTO: CreateCourseDTO) {
        this.coursesService.create(createCourseDTO);
        return res.status(201).json({ message: 'Curso criado com sucesso' });
    }
    @Put(':id')
    update(
        @Res() res,
        @Param('id') id: number,
        @Body() updateCourseDTO: UpdateCourseDTO
    ) {
        this.coursesService.update(id, updateCourseDTO);
        return res.status(204).send();
    }

    @Delete(':id')
    delete(@Res() res, @Param('id') id: number) {
        this.coursesService.remove(id);
        return res.status(204).send();
    }
}
