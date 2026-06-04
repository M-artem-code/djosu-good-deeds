import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { assertObjectId, isValidObjectId } from '../common/utils/mongo-id';
import { isMongoDuplicateKeyError } from '../common/utils/mongo-error';
import { normalizeTag } from '../common/utils/normalize-tag';
import { toPublicUserByTag } from '../common/utils/to-public-user';
import { DeedPublicDto } from '../deeds/dto/deed-public.dto';
import { DeedsService } from '../deeds/deeds.service';
import { UserDocument } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { FriendItemDto } from './dto/friend-item.dto';
import { Friendship, FriendshipDocument } from './schemas/friendship.schema';

@Injectable()
export class FriendsService {
  constructor(
    @InjectModel(Friendship.name)
    private readonly friendshipModel: Model<FriendshipDocument>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly deedsService: DeedsService,
  ) {}

  async addFriend(userId: string, tag: string): Promise<FriendItemDto> {
    const friend = await this.usersService.findByTag(tag);
    if (!friend) {
      throw new NotFoundException('User not found');
    }

    const friendId = friend._id.toString();
    if (friendId === userId) {
      throw new BadRequestException('You cannot add yourself as a friend');
    }

    try {
      const friendship = await this.friendshipModel.create({
        userId: new Types.ObjectId(userId),
        friendId: friend._id,
      });
      return this.toFriendItem(friendship._id.toString(), friend, friendship.createdAt);
    } catch (error: unknown) {
      if (isMongoDuplicateKeyError(error)) {
        throw new ConflictException('Already friends');
      }
      throw error;
    }
  }

  async listFriends(userId: string): Promise<FriendItemDto[]> {
    const friendships = await this.friendshipModel
      .find({ userId: new Types.ObjectId(userId) })
      .populate<{ friendId: UserDocument }>('friendId', 'displayName tag')
      .sort({ createdAt: -1 })
      .exec();

    return friendships
      .filter((friendship) => friendship.friendId != null)
      .map((friendship) =>
        this.toFriendItem(friendship._id.toString(), friendship.friendId, friendship.createdAt),
      );
  }

  async removeFriend(userId: string, friendshipId: string): Promise<void> {
    assertObjectId(friendshipId, 'Friendship not found');

    const result = await this.friendshipModel
      .deleteOne({
        _id: new Types.ObjectId(friendshipId),
        userId: new Types.ObjectId(userId),
      })
      .exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException('Friendship not found');
    }
  }

  async revokeIncomingFriend(currentUserId: string, tag: string): Promise<void> {
    const initiator = await this.usersService.findByTag(normalizeTag(tag));
    if (!initiator) {
      throw new NotFoundException('Friendship not found');
    }

    const result = await this.friendshipModel
      .deleteOne({
        userId: initiator._id,
        friendId: new Types.ObjectId(currentUserId),
      })
      .exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException('Friendship not found');
    }
  }

  async isFriend(userId: string, friendId: string): Promise<boolean> {
    if (!isValidObjectId(userId) || !isValidObjectId(friendId)) {
      return false;
    }

    const friendship = await this.friendshipModel
      .findOne({
        userId: new Types.ObjectId(userId),
        friendId: new Types.ObjectId(friendId),
      })
      .exec();

    return friendship !== null;
  }

  async getFriendDeedsByTag(viewerId: string, tag: string): Promise<DeedPublicDto[]> {
    const friend = await this.usersService.findByTag(normalizeTag(tag));
    if (!friend || !(await this.isFriend(viewerId, friend._id.toString()))) {
      throw new ForbiddenException('You can only view deeds of your friends');
    }

    return this.deedsService.findAllByOwner(friend._id.toString());
  }

  async deleteByUserId(userId: string): Promise<void> {
    if (!isValidObjectId(userId)) {
      return;
    }
    const objectId = new Types.ObjectId(userId);
    await this.friendshipModel
      .deleteMany({
        $or: [{ userId: objectId }, { friendId: objectId }],
      })
      .exec();
  }

  private toFriendItem(friendshipId: string, friend: UserDocument, createdAt: Date): FriendItemDto {
    return {
      _id: friendshipId,
      friend: toPublicUserByTag(friend),
      createdAt,
    };
  }
}
