import { Injectable, NotFoundException } from '@nestjs/common';
import { Course } from './entity/courses.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entity/tags.entity';
import { CreateCourseDTO } from './dto/CreateCourseDTO';
import { UpdateCourseDTO } from './dto/UpdateCourseDTO';

@Injectable()
export class CoursesService {
  @InjectRepository(Course)
  private courseRepository: Repository<Course>;
  @InjectRepository(Tag)
  private tagRepository: Repository<Tag>;

  public async findAll() {
    const courses = await this.courseRepository.find({
      relations: ['tags'],
    });
    return courses;
  }

  public async findOne(id: string) {
    const course = await this.courseRepository.findOneBy({ id });
    if (!course) {
      throw new NotFoundException('Curso não encontrado');
    }
    return course;
  }

  public async create(createCourseDTO: CreateCourseDTO) {
    const tags = await Promise.all(
      createCourseDTO.tags.map((item) => {
        return this.createOrLoadTagByName(item);
      })
    );
    const course = this.courseRepository.create({
      ...createCourseDTO,
      tags,
    });
    return await this.courseRepository.save(course);
  }

  public async update(id: string, updateCourseDTO: UpdateCourseDTO) {
    const tags =
      updateCourseDTO.tags &&
      (await Promise.all(
        updateCourseDTO.tags.map((item) => {
          return this.createOrLoadTagByName(item);
        })
      ));
    const course = await this.courseRepository.preload({
      ...updateCourseDTO,
      tags,
    });
    if (!course) {
      throw new NotFoundException('Curso não encontrado');
    }
    return await this.courseRepository.save(course);
  }

  public async remove(id: string) {
    const course = await this.courseRepository.findOneBy({ id });
    if (!course) {
      throw new NotFoundException('Curso não encontrado');
    }
    await this.courseRepository.remove(course);
  }

  private async createOrLoadTagByName(name: string) {
    const tag = await this.tagRepository.findOne({
      where: {
        description: name,
      },
    });
    if (tag) {
      return tag;
    }
    return this.tagRepository.create({ description: name });
  }
}
