import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { normalizeTag } from '../../common/utils/normalize-tag';
import { IsTag } from '../../common/validators/is-tag';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Alex Updated' })
  @IsOptional()
  @Transform(({ value }: { value: unknown }): unknown =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  displayName?: string;

  @ApiPropertyOptional({
    example: 'alex_new',
    description: '3-32 chars: a-z, 0-9, _',
  })
  @IsOptional()
  @Transform(({ value }: { value: unknown }): unknown =>
    typeof value === 'string' ? normalizeTag(value) : value,
  )
  @IsString()
  @IsTag()
  tag?: string;
}
