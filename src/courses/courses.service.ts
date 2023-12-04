import { HttpException, Injectable } from '@nestjs/common';
import { Course } from './courses.entity';

@Injectable()
export class CoursesService {
    private courses: Course[] = [
        {
            id: 1,
            name: 'NestJS',
            description: 'Cursos sobre os fundamentos do framework NestJS',
            tags: ['Back-end', 'javascript', 'NodeJS'],
        },
    ];

    findAll() {
        return this.courses;
    }

    findOne(id: number) {
        const course = this.courses.find((item) => item.id === id);
        if (!course) {
            throw new HttpException('Curso não encontrado', 404);
        }
        return course;
    }

    create(createCourseDTO: any) {
        return this.courses.push(createCourseDTO);
    }

    update(id: number, updateCourseDTO: any) {
        const idCourse = this.courses.findIndex((item) => item.id === id);
        if (idCourse < 0) {
            throw new HttpException('Curso não encontrado', 404);
        }
        this.courses[idCourse] = {
            id,
            ...updateCourseDTO,
        };
    }

    remove(id: number) {
        const idCourse = this.courses.findIndex((item) => item.id === id);
        if (idCourse < 0) {
            throw new HttpException('Curso não encontrado', 404);
        }
        this.courses.splice(idCourse, 1);
    }
}
