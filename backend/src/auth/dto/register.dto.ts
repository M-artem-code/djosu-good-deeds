import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { normalizeTag } from '../../common/utils/normalize-tag';
import { IsTag } from '../../common/validators/is-tag';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @Transform(({ value }: { value: unknown }): unknown =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'secret12', minLength: 6 })
  @IsString()
  @MinLength(6)
  @MaxLength(128)
  password: string;

  @ApiProperty({ example: 'Alex' })
  @Transform(({ value }: { value: unknown }): unknown =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  displayName: string;

  @ApiProperty({ example: 'alex_good', description: '3-32 chars: a-z, 0-9, _' })
  @Transform(({ value }: { value: unknown }): unknown =>
    typeof value === 'string' ? normalizeTag(value) : value,
  )
  @IsString()
  @IsTag()
  tag: string;
}
