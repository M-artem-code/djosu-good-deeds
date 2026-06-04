import { ApiProperty } from '@nestjs/swagger';
import { UserByTagDto } from '../../common/dto/user-by-tag.dto';

export class FriendItemDto {
  @ApiProperty({ description: 'Friendship record id' })
  _id: string;

  @ApiProperty({ type: UserByTagDto })
  friend: UserByTagDto;

  @ApiProperty()
  createdAt: Date;
}
