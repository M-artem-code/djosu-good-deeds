import { ApiProperty } from '@nestjs/swagger';
import { UserPublicDto } from '../../common/dto/user-public.dto';

export class AuthResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty({ type: () => UserPublicDto })
  user: UserPublicDto;
}
