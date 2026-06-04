export type ApiErrorBody = {
  message?: string | string[];
};

export function isApiErrorWithData(
  error: unknown,
): error is { status: number | string; data?: ApiErrorBody } {
  return typeof error === "object" && error !== null && "status" in error;
}

export function getApiErrorStatus(
  error: unknown,
): number | string | undefined {
  if (isApiErrorWithData(error)) {
    return error.status;
  }
  return undefined;
}

export function getApiErrorData(error: unknown): ApiErrorBody | undefined {
  if (error && typeof error === "object" && "data" in error) {
    return (error as { data?: ApiErrorBody }).data;
  }
  return undefined;
}

export function getApiErrorMessage(
  error: unknown,
): string | string[] | undefined {
  return getApiErrorData(error)?.message;
}

export function getApiMessage(error: unknown): string | null {
  const message = getApiErrorMessage(error);
  if (!message) {
    return null;
  }
  return Array.isArray(message) ? message[0] : message;
}
