import { randomUUID } from 'crypto';
import { CoursesService } from './courses.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Course } from './entity/courses.entity';
import { Repository } from 'typeorm';
import { Tag } from './entity/tags.entity';
import { CreateCourseDTO } from './dto/CreateCourseDTO';

const coursesList: Course[] = [
  new Course({
    id: randomUUID(),
    name: 'test',
    description: 'test',
    tags: [
      new Tag({
        id: randomUUID(),
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
            finnOneBy: jest.fn(),
            create: jest.fn().mockResolvedValue(coursesList[0]),
            save: jest.fn().mockResolvedValue(coursesList[0]),
            preload: jest.fn(),
            remove: jest.fn(),
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

  //   const newCourse = await service.create(createCourseDTO);

  //   expect(mockCourseRepository.create).toHaveBeenCalled();
  //   expect(expectOutputCourses).toStrictEqual(newCourse);
  // });

  // it('should list all courses', async () => {
  //   service['courseRepository'] = mockCourseRepository;

  //   const courses = await service.findAll();
  //   expect(mockCourseRepository.find).toHaveBeenCalled();
  //   expect(expectOutputCourses).toStrictEqual(courses);
  // });

  // it('should be able to get a course by id', async () => {
  //   service['courseRepository'] = mockCourseRepository;

  //   const course = await service.findOne(id);
  //   expect(mockCourseRepository.findOneBy).toHaveBeenCalled();
  //   expect(expectOutputCourses).toStrictEqual(course);
  // });

  // it('should be able to update a course', async () => {
  //   service['courseRepository'] = mockCourseRepository;
  //   service['tagRepository'] = mockTagRepository;

  //   const updateCourseDTO: UpdateCourseDTO = {
  //     name: 'test',
  //     description: 'test',
  //     tags: ['test'],
  //   };

  //   const course = await service.update(id, updateCourseDTO);

  //   expect(mockCourseRepository.preload).toHaveBeenCalled();
  //   expect(mockCourseRepository.save).toHaveBeenCalled();
  //   expect(expectOutputCourses).toStrictEqual(course);
  // });

  // it('should be able to delete a course', async () => {
  //   service['courseRepository'] = mockCourseRepository;

  //   const courseToDelete = await service.remove(id);

  //   expect(mockCourseRepository.remove).toHaveBeenCalled();
  //   expect(courseToDelete).toBeUndefined();
  // });
});
