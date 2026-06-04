import { UserByTagDto } from '../dto/user-by-tag.dto';
import { UserPublicDto } from '../dto/user-public.dto';
import { UserDocument } from '../../users/schemas/user.schema';

export function toPublicUser(user: UserDocument): UserPublicDto {
  return {
    _id: user._id.toString(),
    email: user.email,
    displayName: user.displayName,
    tag: user.tag,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export function toPublicUserByTag(user: UserDocument): UserByTagDto {
  return {
    _id: user._id.toString(),
    displayName: user.displayName,
    tag: user.tag,
  };
}
