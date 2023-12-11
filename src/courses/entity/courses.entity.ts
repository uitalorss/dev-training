import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tag } from './tags.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'text' })
  name: string;
  @Column({ type: 'text' })
  description: string;

  @ManyToMany(() => Tag, (tag) => tag.course, {
    cascade: true,
  })
  @JoinTable()
  tags: Tag[];
}
