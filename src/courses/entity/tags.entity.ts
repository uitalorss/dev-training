import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Course } from './courses.entity';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToMany(() => Course, (course) => course.tags)
  course: Course[];

  constructor(course?: Partial<Course>) {
    this.id = course?.id;
    this.description = course?.description;
  }
}
