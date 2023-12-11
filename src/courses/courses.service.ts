import { Injectable, NotFoundException } from '@nestjs/common';
import { Course } from './entity/courses.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>
  ) {}

  public async findAll() {
    const courses = await this.courseRepository.find();
    return courses;
  }

  public async findOne(id: number) {
    const course = await this.courseRepository.findOneBy({ id });
    if (!course) {
      throw new NotFoundException('Curso não encontrado');
    }
    return course;
  }

  public async create(createCourseDTO: any) {
    const course = this.courseRepository.create(createCourseDTO);
    return await this.courseRepository.save(course);
  }

  public async update(id: number, updateCourseDTO: any) {
    const course = await this.courseRepository.preload({
      id,
      ...updateCourseDTO,
    });
    if (!course) {
      throw new NotFoundException('Curso não encontrado');
    }
    return await this.courseRepository.save(course);
  }

  public async remove(id: number) {
    const course = await this.courseRepository.findOneBy({ id });
    if (!course) {
      throw new NotFoundException('Curso não encontrado');
    }
    this.courseRepository.remove(course);
  }
}
