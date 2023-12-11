import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Course } from './courses.entity';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  description: string;

  @ManyToMany(() => Course, (course) => course.tags)
  course: Course[];
}
