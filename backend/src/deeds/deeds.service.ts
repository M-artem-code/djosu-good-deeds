import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { assertAtLeastOneField } from '../common/validators/assert-at-least-one-field';
import { assertObjectId, isValidObjectId } from '../common/utils/mongo-id';
import { toPublicDeed } from '../common/utils/to-public-deed';
import { CreateDeedDto } from './dto/create-deed.dto';
import { DeedPublicDto } from './dto/deed-public.dto';
import { UpdateDeedDto } from './dto/update-deed.dto';
import { Deed, DeedDocument } from './schemas/deed.schema';

@Injectable()
export class DeedsService {
  constructor(@InjectModel(Deed.name) private readonly deedModel: Model<DeedDocument>) {}

  async create(ownerId: string, dto: CreateDeedDto): Promise<DeedPublicDto> {
    const deed = await this.deedModel.create({
      ownerId: new Types.ObjectId(ownerId),
      title: dto.title,
      description: dto.description,
    });
    return toPublicDeed(deed);
  }

  async findAllByOwner(ownerId: string): Promise<DeedPublicDto[]> {
    const deeds = await this.deedModel
      .find({ ownerId: new Types.ObjectId(ownerId) })
      .sort({ createdAt: -1 })
      .exec();
    return deeds.map(toPublicDeed);
  }

  async findOneByOwnerOrThrow(ownerId: string, deedId: string): Promise<DeedPublicDto> {
    const deed = await this.findOwnedDocument(ownerId, deedId);
    return toPublicDeed(deed);
  }

  async updateByOwner(ownerId: string, deedId: string, dto: UpdateDeedDto): Promise<DeedPublicDto> {
    assertAtLeastOneField(
      dto,
      ['title', 'description', 'status'],
      'At least one of title, description, or status must be provided',
    );
    const deed = await this.findOwnedDocument(ownerId, deedId);
    if (dto.title !== undefined) deed.title = dto.title;
    if (dto.description !== undefined) deed.description = dto.description;
    if (dto.status !== undefined) deed.status = dto.status;
    await deed.save();
    return toPublicDeed(deed);
  }

  async deleteByOwner(ownerId: string, deedId: string): Promise<void> {
    assertObjectId(deedId, 'Deed not found');
    const result = await this.deedModel
      .deleteOne({
        _id: new Types.ObjectId(deedId),
        ownerId: new Types.ObjectId(ownerId),
      })
      .exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Deed not found');
    }
  }

  async deleteByOwnerId(ownerId: string): Promise<void> {
    if (!isValidObjectId(ownerId)) {
      return;
    }
    await this.deedModel.deleteMany({ ownerId: new Types.ObjectId(ownerId) }).exec();
  }

  private async findOwnedDocument(ownerId: string, deedId: string): Promise<DeedDocument> {
    assertObjectId(deedId, 'Deed not found');
    const deed = await this.deedModel
      .findOne({
        _id: new Types.ObjectId(deedId),
        ownerId: new Types.ObjectId(ownerId),
      })
      .exec();
    if (!deed) {
      throw new NotFoundException('Deed not found');
    }
    return deed;
  }
}
