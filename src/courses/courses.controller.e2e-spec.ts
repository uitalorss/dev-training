import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { CreateCourseDTO } from './dto/CreateCourseDTO';
import { Course } from './entity/courses.entity';
import { Tag } from './entity/tags.entity';
import { CoursesModule } from './courses.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import request from 'supertest';
import { UpdateCourseDTO } from './dto/UpdateCourseDTO';

describe('CoursesController', () => {
  let app: INestApplication;
  let module: TestingModule;
  let createCourseDTO: CreateCourseDTO;
  let updateCourseDTO: UpdateCourseDTO;
  let courses: Course[];

  const dataSourceTest: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(5429),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [Course, Tag],
    synchronize: true,
  };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        CoursesModule,
        TypeOrmModule.forRootAsync({
          useFactory: async () => {
            return dataSourceTest;
          },
        }),
      ],
    }).compile();
    app = module.createNestApplication();
    createCourseDTO = {
      name: 'test',
      description: 'test',
      tags: ['test'],
    };

    updateCourseDTO = {
      name: 'correctTest',
      description: 'test 2',
      tags: ['test', 'another test'],
    };

    await app.init();
  });

  beforeEach(async () => {
    const dataSource = await new DataSource(dataSourceTest).initialize();
    const repository = dataSource.getRepository(Course);
    courses = await repository.find();
    await dataSource.destroy();
  });

  afterAll(async () => {
    await module.close();
  });

  describe('POST /courses', () => {
    it('should be able to create a course', async () => {
      const res = await request(app.getHttpServer())
        .post('/courses')
        .send(createCourseDTO)
        .expect(201);

      expect(res).toBeDefined();
    });
  });

  describe('GET /courses', () => {
    it('should be able to get all courses', async () => {
      const res = await request(app.getHttpServer())
        .get('/courses')
        .expect(200);

      expect(res.body).toBeInstanceOf(Array<Course>);
    });
  });

  describe('GET /courses/:id', () => {
    it('should be able to get a course by id', async () => {
      const res = await request(app.getHttpServer())
        .get(`/courses/${courses[0].id}`)
        .expect(200);

      expect(res.body.id).toStrictEqual(courses[0].id);
    });
  });

  describe('PUT /courses/:id', () => {
    it('should be able to update a course', async () => {
      const res = await request(app.getHttpServer())
        .put(`/courses/${courses[0].id}`)
        .send(updateCourseDTO)
        .expect(204);

      expect(res.body).toBeDefined();
    });
  });

  describe('DELETE /courses/:id', () => {
    it('should be able to delete a test', async () => {
      const res = await request(app.getHttpServer())
        .del(`/courses/${courses[0].id}`)
        .send(courses[0].id)
        .expect(204);

      expect(res.body).toBeDefined();
    });
  });
});
