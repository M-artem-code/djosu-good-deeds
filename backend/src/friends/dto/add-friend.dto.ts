import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';
import { normalizeTag } from '../../common/utils/normalize-tag';
import { IsTag } from '../../common/validators/is-tag';

export class AddFriendDto {
  @ApiProperty({
    example: 'alice_good',
    description: '3-32 chars: a-z, 0-9, _',
  })
  @Transform(({ value }: { value: unknown }): unknown =>
    typeof value === 'string' ? normalizeTag(value) : value,
  )
  @IsString()
  @IsTag()
  tag: string;
}
