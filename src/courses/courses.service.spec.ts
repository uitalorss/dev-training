import { CoursesService } from './courses.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Course } from './entity/courses.entity';
import { Repository } from 'typeorm';
import { Tag } from './entity/tags.entity';
import { CreateCourseDTO } from './dto/CreateCourseDTO';
import { UpdateCourseDTO } from './dto/UpdateCourseDTO';
import { NotFoundException } from '@nestjs/common';

const coursesList: Course[] = [
  new Course({
    id: 'd22f92b5-731d-4166-98ed-6c3b104c0da0',
    name: 'test',
    description: 'test',
    tags: [
      new Tag({
        id: 'd22f92b5-731d-4166-98ed-6c3b104c0da0',
        description: 'test',
      }),
    ],
  }),
];

describe('CoursesService', () => {
  let coursesService: CoursesService;
  let coursesRepository: Repository<Course>;
  let tagsRepository: Repository<Tag>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        {
          provide: getRepositoryToken(Course),
          useValue: {
            find: jest.fn().mockResolvedValue(coursesList),
            findOneBy: jest.fn().mockResolvedValue(coursesList[0]),
            create: jest.fn().mockResolvedValue(coursesList[0]),
            save: jest.fn().mockResolvedValue(coursesList[0]),
            preload: jest.fn().mockResolvedValue(coursesList[0]),
            remove: jest.fn().mockResolvedValue(coursesList[0]),
          },
        },
        {
          provide: getRepositoryToken(Tag),
          useValue: {
            findOne: jest.fn().mockResolvedValue(coursesList[0].tags),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    coursesService = module.get<CoursesService>(CoursesService);
    coursesRepository = module.get<Repository<Course>>(
      getRepositoryToken(Course)
    );
    tagsRepository = module.get<Repository<Tag>>(getRepositoryToken(Tag));
  });

  it('should be defined', () => {
    expect(coursesService).toBeDefined();
  });

  it('should be able to create a course', async () => {
    const item: CreateCourseDTO = {
      name: 'test',
      description: 'test',
      tags: ['test'],
    };

    const result = await coursesService.create(item);

    expect(tagsRepository.findOne).toHaveBeenCalled();
    expect(coursesRepository.create).toHaveBeenCalled();
    expect(coursesRepository.save).toHaveBeenCalled();
    expect(result).toStrictEqual(coursesList[0]);
  });

  it('should be able to list all courses', async () => {
    const result = await coursesService.findAll();

    expect(result).toEqual(coursesList);
    expect(coursesRepository.find).toHaveBeenCalled();
  });

  it('should be able to list a course according to your id', async () => {
    const course = await coursesService.findOne(
      'd22f92b5-731d-4166-98ed-6c3b104c0da0'
    );

    expect(coursesRepository.findOneBy).toHaveBeenCalled();
    expect(course).toStrictEqual(coursesList[0]);
  });

  it('should not be able to list a course your id does not exist', () => {
    jest
      .spyOn(coursesRepository, 'findOneBy')
      .mockRejectedValueOnce(new NotFoundException());

    expect(
      coursesService.findOne('d22f92b5-731d-4166-98ed-6c3b104c0da0')
    ).rejects.toThrow(NotFoundException);
  });

  it('should be able to update a course', async () => {
    const item: UpdateCourseDTO = {
      name: 'test',
      description: 'test',
      tags: ['test'],
    };
    await coursesService.update('d22f92b5-731d-4166-98ed-6c3b104c0da0', item);

    expect(coursesRepository.preload).toHaveBeenCalled();
    expect(coursesRepository.save).toHaveBeenCalled();
  });

  it('should not be able to update a course your id does not exist', () => {
    jest
      .spyOn(coursesRepository, 'preload')
      .mockRejectedValueOnce(new NotFoundException());

    const item: UpdateCourseDTO = {
      name: 'test',
      description: 'test',
      tags: ['test'],
    };
    expect(
      coursesService.update('d22f92b5-731d-4166-98ed-6c3b104c0da0', item)
    ).rejects.toThrow(NotFoundException);
  });

  it('should be able to remove a course', async () => {
    await coursesService.remove('d22f92b5-731d-4166-98ed-6c3b104c0da0');

    expect(coursesRepository.findOneBy).toHaveBeenCalled();
    expect(coursesRepository.remove).toHaveBeenCalled();
  });

  it('should not be able to remove a course your id does not exist', () => {
    jest
      .spyOn(coursesRepository, 'findOneBy')
      .mockRejectedValueOnce(new NotFoundException());

    expect(
      coursesService.remove('d22f92b5-731d-4166-98ed-6c3b104c0da0')
    ).rejects.toThrow(NotFoundException);
  });
});
