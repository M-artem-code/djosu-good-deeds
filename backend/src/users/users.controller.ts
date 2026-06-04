import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserByTagDto } from '../common/dto/user-by-tag.dto';
import { UserPublicDto } from '../common/dto/user-public.dto';
import { normalizeTag } from '../common/utils/normalize-tag';
import { toPublicUser } from '../common/utils/to-public-user';
import { UpdateProfileDto } from './dto/update-profile.dto';
import type { UserDocument } from './schemas/user.schema';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOkResponse({ type: UserPublicDto })
  getMe(@CurrentUser() user: UserDocument) {
    return toPublicUser(user);
  }

  @Patch('me')
  @ApiOkResponse({ type: UserPublicDto })
  @ApiConflictResponse({ description: 'Tag already exists' })
  @ApiNotFoundResponse()
  updateMe(@CurrentUser() user: UserDocument, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(user._id.toString(), dto);
  }

  @Delete('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  async deleteMe(@CurrentUser() user: UserDocument) {
    await this.usersService.deleteAccount(user._id.toString());
  }

  @Get('by-tag/:tag')
  @ApiOkResponse({ type: UserByTagDto })
  @ApiNotFoundResponse()
  getByTag(@Param('tag') tag: string) {
    return this.usersService.getPublicProfileByTag(normalizeTag(tag));
  }
}
