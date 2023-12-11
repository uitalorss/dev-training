import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'text' })
  name: string;
  @Column({ type: 'text' })
  description: string;

  @Column('json', { nullable: true })
  tags: string[];
}
