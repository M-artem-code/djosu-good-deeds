import {
  handleFormMutationError,
  type FieldErrors,
  type HandleFormMutationErrorOptions,
} from "./form-mutation-errors";
import { mapConflictError, mapValidationErrors } from "./validation-errors";

export type AuthFieldErrors = FieldErrors;

export type HandleAuthMutationErrorOptions = Omit<
  HandleFormMutationErrorOptions,
  "mappers" | "handle404"
> & {
  handle409?: boolean;
};

export function handleAuthMutationError(
  error: unknown,
  options: HandleAuthMutationErrorOptions,
): void {
  handleFormMutationError(error, {
    ...options,
    mappers: {
      map400: mapValidationErrors,
      map409: mapConflictError,
    },
  });
}
