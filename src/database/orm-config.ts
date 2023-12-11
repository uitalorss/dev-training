import { Course } from 'src/courses/entity/courses.entity';
import { Tag } from 'src/courses/entity/tags.entity';
import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5430,
  username: 'postgres',
  password: 'postgresql',
  database: 'devtraining',
  entities: [Course, Tag],
  synchronize: false,
};

export const dataSource = new DataSource({
  ...dataSourceOptions,
  synchronize: false,
  migrations: ['./src/database/migrations/*.{ts, js}'],
});
