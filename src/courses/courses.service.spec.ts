import { CoursesService } from './courses.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Course } from './entity/courses.entity';
import { Tag } from './entity/tags.entity';
import { randomUUID } from 'crypto';
import { NotFoundException } from '@nestjs/common';

describe('CoursesService', () => {
  let coursesService: CoursesService;

  const mockCourse = new Course({
    id: randomUUID(),
    name: 'test',
    description: 'test',
    tags: [
      new Tag({
        id: randomUUID(),
        description: 'test',
      }),
    ],
  });

  const mockRepositoryCourse = {
    find: jest.fn().mockReturnValue([mockCourse]),
    findOneBy: jest.fn().mockReturnValue(mockCourse),
    create: jest.fn(),
    save: jest.fn(),
    preload: jest.fn(),
    remove: jest.fn(),
  };

  const mockRepositoryTag = {
    findOne: jest.fn(),
    create: jest.fn(),
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
      jest
        .spyOn(mockRepositoryCourse, 'findOneBy')
        .mockRejectedValue(new NotFoundException());

      expect(coursesService.findOne('123')).rejects.toBeInstanceOf(
        NotFoundException
      );
    });
  });
});
