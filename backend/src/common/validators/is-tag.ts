import { Matches } from 'class-validator';
import { TAG_PATTERN, TAG_VALIDATION_MESSAGE } from './tag.constants';

export function IsTag() {
  return Matches(TAG_PATTERN, { message: TAG_VALIDATION_MESSAGE });
}
