import { DeedPublicDto } from '../../deeds/dto/deed-public.dto';
import { DeedDocument } from '../../deeds/schemas/deed.schema';

export function toPublicDeed(deed: DeedDocument): DeedPublicDto {
  return {
    _id: deed._id.toString(),
    ownerId: deed.ownerId.toString(),
    title: deed.title,
    description: deed.description,
    status: deed.status,
    createdAt: deed.createdAt,
    updatedAt: deed.updatedAt,
  };
}
