import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsIn,
  IsDateString,
  MaxLength,
} from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Complete project documentation',
    description: 'Task title',
    maxLength: 200,
  })
  @IsString()
  @MaxLength(200)
  title!: string;

  @ApiPropertyOptional({
    example: 'Write API docs and update README',
    description: 'Task description',
    maxLength: 2000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional({
    example: 'High',
    description: 'Task priority',
    enum: ['Low', 'Medium', 'High'],
  })
  @IsOptional()
  @IsIn(['Low', 'Medium', 'High'])
  priority?: string;

  @ApiPropertyOptional({
    example: 'To Do',
    description: 'Task status',
    enum: ['To Do', 'In Progress', 'Done'],
  })
  @IsOptional()
  @IsIn(['To Do', 'In Progress', 'Done'])
  status?: string;

  @ApiPropertyOptional({
    example: '2026-05-30',
    description: 'Due date in ISO format',
  })
  @IsOptional()
  @IsDateString()
  dueDate?: string;
}
