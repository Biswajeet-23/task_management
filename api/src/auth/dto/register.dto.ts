import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterDto {
    @ApiProperty({
        example: 'user@example.com',
        description: 'User email address',
    })
    @IsEmail({}, { message: 'Please provide a valid email address' })
    email!: string;

    @ApiProperty({
        example: 'password123',
        description: 'User password (min 6 chars)',
    })
    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @MaxLength(100)
    password!: string;
}
