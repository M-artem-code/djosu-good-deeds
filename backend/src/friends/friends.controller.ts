import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { normalizeTag } from '../common/utils/normalize-tag';
import { DeedPublicDto } from '../deeds/dto/deed-public.dto';
import type { UserDocument } from '../users/schemas/user.schema';
import { AddFriendDto } from './dto/add-friend.dto';
import { FriendItemDto } from './dto/friend-item.dto';
import { FriendsService } from './friends.service';

@ApiTags('friends')
@ApiBearerAuth()
@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Post()
  @ApiCreatedResponse({ type: FriendItemDto })
  @ApiBadRequestResponse({ description: 'Cannot add yourself as a friend' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiConflictResponse({ description: 'Already friends' })
  addFriend(@CurrentUser() user: UserDocument, @Body() dto: AddFriendDto) {
    return this.friendsService.addFriend(user._id.toString(), dto.tag);
  }

  @Get()
  @ApiOkResponse({ type: [FriendItemDto] })
  listFriends(@CurrentUser() user: UserDocument) {
    return this.friendsService.listFriends(user._id.toString());
  }

  @Get(':tag/deeds')
  @ApiOkResponse({ type: [DeedPublicDto] })
  @ApiForbiddenResponse({
    description: 'Not friends with this user (includes unknown tag — anti-enumeration)',
  })
  getFriendDeeds(@CurrentUser() user: UserDocument, @Param('tag') tag: string) {
    return this.friendsService.getFriendDeedsByTag(user._id.toString(), normalizeTag(tag));
  }

  @Delete(':friendshipId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  removeFriend(@CurrentUser() user: UserDocument, @Param('friendshipId') friendshipId: string) {
    return this.friendsService.removeFriend(user._id.toString(), friendshipId);
  }
}
