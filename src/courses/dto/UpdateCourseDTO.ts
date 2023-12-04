import { PartialType } from '@nestjs/mapped-types';
import { CreateCourseDTO } from './CreateCourseDTO';

export class UpdateCourseDTO extends PartialType(CreateCourseDTO) {}
