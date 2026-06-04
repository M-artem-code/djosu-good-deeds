import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DeedStatus } from '../schemas/deed.schema';

export class DeedPublicDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  ownerId: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ enum: DeedStatus })
  status: DeedStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
