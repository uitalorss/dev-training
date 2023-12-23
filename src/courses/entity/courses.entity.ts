import { Tag } from './tags.entity';
import {
  Entity,
  Column,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @ManyToMany(() => Tag, (tag) => tag.course, {
    cascade: true,
  })
  @JoinTable()
  tags: Tag[];

  constructor(course?: Partial<Course>) {
    this.id = course?.id;
    this.name = course?.name;
    this.description = course?.description;
    this.tags = course?.tags;
    this.created_at = course?.created_at;
  }
}
