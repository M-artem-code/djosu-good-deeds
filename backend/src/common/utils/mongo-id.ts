import { NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';

export function isValidObjectId(id: string): boolean {
  return Types.ObjectId.isValid(id);
}

export function toObjectIdOrNull(id: string): Types.ObjectId | null {
  if (!isValidObjectId(id)) {
    return null;
  }
  return new Types.ObjectId(id);
}

export function assertObjectId(id: string, notFoundMessage = 'Resource not found'): Types.ObjectId {
  if (!isValidObjectId(id)) {
    throw new NotFoundException(notFoundMessage);
  }
  return new Types.ObjectId(id);
}
