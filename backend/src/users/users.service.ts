import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserByTagDto } from '../common/dto/user-by-tag.dto';
import { UserPublicDto } from '../common/dto/user-public.dto';
import { isMongoDuplicateKeyError } from '../common/utils/mongo-error';
import { toObjectIdOrNull } from '../common/utils/mongo-id';
import { normalizeTag } from '../common/utils/normalize-tag';
import { toPublicUser, toPublicUserByTag } from '../common/utils/to-public-user';
import { assertAtLeastOneField } from '../common/validators/assert-at-least-one-field';
import { DeedsService } from '../deeds/deeds.service';
import { FriendsService } from '../friends/friends.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly deedsService: DeedsService,
    @Inject(forwardRef(() => FriendsService))
    private readonly friendsService: FriendsService,
  ) {}

  async findById(id: string): Promise<UserDocument | null> {
    const objectId = toObjectIdOrNull(id);
    if (!objectId) return null;
    return this.userModel.findById(objectId).exec();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase().trim() }).exec();
  }

  async findByEmailWithPassword(email: string): Promise<UserDocument | null> {
    return this.userModel
      .findOne({ email: email.toLowerCase().trim() })
      .select('+passwordHash')
      .exec();
  }

  async findByTag(tag: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ tag: normalizeTag(tag) }).exec();
  }

  async create(data: {
    email: string;
    passwordHash: string;
    displayName: string;
    tag: string;
  }): Promise<UserDocument> {
    try {
      return await this.userModel.create({
        email: data.email.toLowerCase().trim(),
        passwordHash: data.passwordHash,
        displayName: data.displayName,
        tag: normalizeTag(data.tag),
      });
    } catch (error: unknown) {
      if (isMongoDuplicateKeyError(error)) {
        throw new ConflictException('Email or tag already exists');
      }
      throw error;
    }
  }

  async getPublicProfileByTag(tag: string): Promise<UserByTagDto> {
    const user = await this.findByTag(tag);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return toPublicUserByTag(user);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<UserPublicDto> {
    assertAtLeastOneField(
      dto,
      ['displayName', 'tag'],
      'At least one of displayName or tag must be provided',
    );
    const update: Partial<User> = {};
    if (dto.displayName !== undefined) {
      update.displayName = dto.displayName;
    }
    if (dto.tag !== undefined) {
      update.tag = normalizeTag(dto.tag);
    }

    try {
      const user = await this.userModel.findByIdAndUpdate(userId, update, { new: true }).exec();
      if (!user) throw new NotFoundException('User not found');
      return toPublicUser(user);
    } catch (error: unknown) {
      if (isMongoDuplicateKeyError(error)) {
        throw new ConflictException('Tag already exists');
      }
      throw error;
    }
  }

  async deleteAccount(userId: string) {
    await this.deedsService.deleteByOwnerId(userId);
    await this.friendsService.deleteByUserId(userId);
    const result = await this.userModel.findByIdAndDelete(userId).exec();
    if (!result) throw new NotFoundException('User not found');
  }
}
