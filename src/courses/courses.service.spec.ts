import { CoursesService } from './courses.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Course } from './entity/courses.entity';
import { Tag } from './entity/tags.entity';
import { randomUUID } from 'crypto';
import { NotFoundException } from '@nestjs/common';
import { CreateCourseDTO } from './dto/CreateCourseDTO';
import { UpdateCourseDTO } from './dto/UpdateCourseDTO';

describe('CoursesService', () => {
  let coursesService: CoursesService;
  const id = randomUUID();

  const mockCourse = new Course({
    id,
    name: 'test',
    description: 'test',
    tags: [
      new Tag({
        id,
        description: 'test',
      }),
    ],
  });

  const mockRepositoryCourse = {
    find: jest.fn().mockReturnValue([mockCourse]),
    findOneBy: jest.fn().mockReturnValue(mockCourse),
    create: jest.fn().mockReturnValue(mockCourse),
    save: jest.fn().mockReturnValue(mockCourse),
    preload: jest.fn().mockReturnValue(mockCourse),
    remove: jest.fn(),
  };

  const mockRepositoryTag = {
    findOne: jest.fn().mockReturnValue(mockCourse.tags),
    create: jest.fn().mockReturnValue(mockCourse.tags),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        {
          provide: getRepositoryToken(Course),
          useValue: mockRepositoryCourse,
        },
        {
          provide: getRepositoryToken(Tag),
          useValue: mockRepositoryTag,
        },
      ],
    }).compile();

    coursesService = module.get<CoursesService>(CoursesService);
  });

  it('should be defined', () => {
    expect(coursesService).toBeDefined();
  });

  describe('when listing all courses', () => {
    it('should be able to list all of them', async () => {
      const courses = await coursesService.findAll();

      expect(mockRepositoryCourse.find).toHaveBeenCalled();
      expect(courses).toBeInstanceOf(Array<Course>);
    });
  });

  describe('when taking a course by id', () => {
    it('should be able to get a course', async () => {
      const course = await coursesService.findOne(randomUUID());

      expect(mockRepositoryCourse.findOneBy).toHaveBeenCalled();
      expect(course).toStrictEqual(mockCourse);
    });

    it('should get a Error if id does not exist', async () => {
      jest.spyOn(mockRepositoryCourse, 'findOneBy').mockReturnValueOnce(null);

      expect(coursesService.findOne('123')).rejects.toThrow(NotFoundException);
    });
  });

  describe('when creating a course', () => {
    const courseToCreate: CreateCourseDTO = {
      name: 'test',
      description: 'test',
      tags: ['test'],
    };

    it('should be able to create it.', async () => {
      const newCourse = await coursesService.create(courseToCreate);

      expect(mockRepositoryCourse.create).toHaveBeenCalled();
      expect(mockRepositoryTag.findOne).toHaveBeenCalled();
      expect(mockRepositoryCourse.save).toHaveBeenCalled();
      expect(newCourse).toStrictEqual(mockCourse);
    });

    it('should be able to create a tag when does not exist', async () => {
      jest.spyOn(mockRepositoryTag, 'findOne').mockReturnValueOnce(null);
      const newCourse = await coursesService.create(courseToCreate);

      expect(mockRepositoryTag.create).toHaveBeenCalled();
      expect(newCourse).toStrictEqual(mockCourse);
    });
  });

  describe('when updating a course', () => {
    const courseToUpdate: UpdateCourseDTO = {
      name: 'test',
      description: 'test',
      tags: ['test'],
    };

    it('should be able to update it', async () => {
      const updateCourse = await coursesService.update(id, courseToUpdate);

      expect(mockRepositoryCourse.preload).toHaveBeenCalled();
      expect(mockRepositoryCourse.save).toHaveBeenCalled();
      expect(updateCourse).toStrictEqual(mockCourse);
    });

    it('should not be able to update a course if id does not exists', async () => {
      jest.spyOn(mockRepositoryCourse, 'preload').mockReturnValueOnce(null);

      await expect(
        coursesService.update('123', courseToUpdate)
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('when deleting a course', () => {
    it('should be able to delete a course', async () => {
      const userToDelete = await coursesService.remove(id);

      expect(mockRepositoryCourse.findOneBy).toHaveBeenCalled();
      expect(mockRepositoryCourse.remove).toHaveBeenCalled();
      expect(userToDelete).toBeUndefined();
    });

    it('should not be able if id does not exist', async () => {
      jest.spyOn(mockRepositoryCourse, 'findOneBy').mockReturnValueOnce(null);

      expect(mockRepositoryCourse.findOneBy).toHaveBeenCalled();
      expect(coursesService.remove('123')).rejects.toThrow(NotFoundException);
    });
  });
});
