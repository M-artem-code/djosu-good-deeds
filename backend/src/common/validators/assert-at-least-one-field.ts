import { BadRequestException } from '@nestjs/common';

/** Ensures at least one of the listed DTO fields is present (PATCH body not empty). */
export function assertAtLeastOneField(value: object, fields: string[], message: string): void {
  const record = value as Record<string, unknown>;
  if (!fields.some((field) => record[field] !== undefined)) {
    throw new BadRequestException(message);
  }
}
