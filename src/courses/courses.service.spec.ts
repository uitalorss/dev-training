import { randomUUID } from 'crypto';
import { CoursesService } from './courses.service';
import { CreateCourseDTO } from './dto/CreateCourseDTO';
import { UpdateCourseDTO } from './dto/UpdateCourseDTO';

describe('CoursesService', () => {
  let service: CoursesService;
  let id: string;
  let created_at: Date;
  let expectOutputTags: any;
  let expectOutputCourses: any;
  let mockCourseRepository: any;
  let mockTagRepository: any;

  beforeEach(async () => {
    service = new CoursesService();

    id = randomUUID();
    created_at = new Date();
    expectOutputTags = [
      {
        id,
        description: test,
      },
    ];
    expectOutputCourses = {
      id,
      name: 'test',
      description: 'test',
      tags: expectOutputTags,
      created_at,
    };

    mockCourseRepository = {
      create: jest.fn().mockReturnValue(Promise.resolve(expectOutputCourses)),
      find: jest.fn().mockReturnValue(Promise.resolve(expectOutputCourses)),
      findOneBy: jest
        .fn()
        .mockReturnValue(Promise.resolve(expectOutputCourses)),
      save: jest.fn().mockReturnValue(Promise.resolve(expectOutputCourses)),
      preload: jest.fn().mockReturnValue(Promise.resolve(expectOutputCourses)),
      remove: jest.fn().mockReturnValue(Promise.resolve(expectOutputCourses)),
    };

    mockTagRepository = {
      findOne: jest.fn().mockReturnValue(Promise.resolve(expectOutputTags)),
      create: jest.fn().mockReturnValue(Promise.resolve(expectOutputTags)),
    };
  });

  it('should be able to create a course', async () => {
    service['courseRepository'] = mockCourseRepository;
    service['tagRepository'] = mockTagRepository;

    const createCourseDTO: CreateCourseDTO = {
      name: 'test',
      description: 'test',
      tags: ['test'],
    };

    const newCourse = await service.create(createCourseDTO);

    expect(mockCourseRepository.create).toHaveBeenCalled();
    expect(expectOutputCourses).toStrictEqual(newCourse);
  });

  it('should list all courses', async () => {
    service['courseRepository'] = mockCourseRepository;

    const courses = await service.findAll();
    expect(mockCourseRepository.find).toHaveBeenCalled();
    expect(expectOutputCourses).toStrictEqual(courses);
  });

  it('should be able to get a course by id', async () => {
    service['courseRepository'] = mockCourseRepository;

    const course = await service.findOne(id);
    expect(mockCourseRepository.findOneBy).toHaveBeenCalled();
    expect(expectOutputCourses).toStrictEqual(course);
  });

  it('should be able to update a course', async () => {
    service['courseRepository'] = mockCourseRepository;
    service['tagRepository'] = mockTagRepository;

    const updateCourseDTO: UpdateCourseDTO = {
      name: 'test',
      description: 'test',
      tags: ['test'],
    };

    const course = await service.update(id, updateCourseDTO);

    expect(mockCourseRepository.preload).toHaveBeenCalled();
    expect(mockCourseRepository.save).toHaveBeenCalled();
    expect(expectOutputCourses).toStrictEqual(course);
  });

  it('should be able to delete a course', async () => {
    service['courseRepository'] = mockCourseRepository;

    const courseToDelete = await service.remove(id);

    expect(mockCourseRepository.remove).toHaveBeenCalled();
    expect(courseToDelete).toBeUndefined();
  });
});
