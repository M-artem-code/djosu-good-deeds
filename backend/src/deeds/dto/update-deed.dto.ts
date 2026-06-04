import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { DeedStatus } from '../schemas/deed.schema';

export class UpdateDeedDto {
  @ApiPropertyOptional({ example: 'Help neighbor updated', maxLength: 120 })
  @IsOptional()
  @Transform(({ value }: { value: unknown }): unknown =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  title?: string;

  @ApiPropertyOptional({ maxLength: 500 })
  @IsOptional()
  @Transform(({ value }: { value: unknown }): unknown => {
    if (typeof value !== 'string') return value;
    const trimmed = value.trim();
    return trimmed === '' ? undefined : trimmed;
  })
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ enum: DeedStatus })
  @IsOptional()
  @IsEnum(DeedStatus)
  status?: DeedStatus;
}
