import {
  getApiErrorMessage,
  getApiErrorStatus,
  getApiMessage,
} from "./errors";
import {
  mapConflictError,
  mapValidationErrors,
} from "./validation-errors";

export type FieldErrors = Record<string, string>;

export type FormMutationMappers = {
  map400?: (message: string | string[]) => FieldErrors;
  map409?: (message: string) => FieldErrors;
  map404?: (message: string) => FieldErrors;
};

export type HandleFormMutationErrorOptions = {
  onFieldErrors: (errors: FieldErrors) => void;
  onFormError?: (message: string) => void;
  defaultFormError?: string;
  mappers?: FormMutationMappers;
  handle409?: boolean;
  handle404?: boolean;
};

export function handleFormMutationError(
  error: unknown,
  options: HandleFormMutationErrorOptions,
): void {
  const status = getApiErrorStatus(error);
  const { mappers } = options;

  if (status === 400) {
    const message = getApiErrorMessage(error);
    if (message) {
      const mapped = mappers?.map400
        ? mappers.map400(message)
        : mapValidationErrors(message);
      options.onFieldErrors(mapped);
    }
    return;
  }

  if (status === 409 && options.handle409) {
    const message = getApiMessage(error);
    if (message) {
      options.onFieldErrors(
        mappers?.map409 ? mappers.map409(message) : mapConflictError(message),
      );
    }
    return;
  }

  if (status === 404 && options.handle404) {
    const message = getApiMessage(error);
    options.onFieldErrors(
      mappers?.map404
        ? mappers.map404(message ?? "Not found")
        : { tag: message ?? "Not found" },
    );
    return;
  }

  if (options.onFormError) {
    options.onFormError(
      getApiMessage(error) ??
        options.defaultFormError ??
        "Something went wrong. Try again.",
    );
  }
}
