"use client";

import {
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  handleFormMutationError,
  type FormMutationMappers,
} from "@/shared/api/form-mutation-errors";
import type { FormFieldErrors, FormValidator } from "./types";

export interface UseMutationFormOptions<TValues, TResult> {
  /** Initial field values. Captured once on mount. */
  initialValues: TValues;
  /** Performs the network request; should reject with an RTK Query error. */
  submit: (values: TValues) => Promise<TResult>;
  /** Loading flag from the RTK Query mutation (`isLoading`). */
  isSubmitting?: boolean;
  /** Optional synchronous client-side validation (e.g. a zod validator). */
  validate?: FormValidator<TValues>;
  /** Invoked after a successful submit. */
  onSuccess?: (result: TResult) => void;
  /** Maps API error messages to field errors (see `handleFormMutationError`). */
  mappers?: FormMutationMappers;
  handle409?: boolean;
  handle404?: boolean;
  defaultFormError?: string;
}

export interface MutationForm<TValues> {
  values: TValues;
  setValue: <K extends keyof TValues>(key: K, value: TValues[K]) => void;
  reset: (next?: Partial<TValues>) => void;
  fieldErrors: FormFieldErrors<TValues>;
  setFieldError: (
    key: Extract<keyof TValues, string>,
    message: string | undefined,
  ) => void;
  formError: string | null;
  setFormError: (message: string | null) => void;
  isSubmitting: boolean;
  handleSubmit: (event: FormEvent) => Promise<void>;
}

/**
 * Generic controlled-form engine for RTK Query mutations. Owns field values,
 * field/form errors, optional client validation, and the submit lifecycle
 * (`preventDefault` → validate → submit → map errors), removing the repeated
 * `useState` + `try/catch(handleFormMutationError)` boilerplate from features.
 */
export function useMutationForm<
  TValues extends Record<string, unknown>,
  TResult,
>(
  options: UseMutationFormOptions<TValues, TResult>,
): MutationForm<TValues> {
  const {
    initialValues,
    submit,
    isSubmitting: externalSubmitting = false,
    validate,
    onSuccess,
    mappers,
    handle409,
    handle404,
    defaultFormError,
  } = options;

  const initialRef = useRef(initialValues);
  const [values, setValues] = useState<TValues>(initialValues);
  const [fieldErrors, setFieldErrors] = useState<FormFieldErrors<TValues>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [internalSubmitting, setInternalSubmitting] = useState(false);

  const valuesRef = useRef(values);
  useEffect(() => {
    valuesRef.current = values;
  }, [values]);

  const setValue = useCallback(
    <K extends keyof TValues>(key: K, value: TValues[K]) => {
      setValues((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const reset = useCallback((next?: Partial<TValues>) => {
    setValues({ ...initialRef.current, ...(next ?? {}) });
    setFieldErrors({});
    setFormError(null);
  }, []);

  const setFieldError = useCallback(
    (key: Extract<keyof TValues, string>, message: string | undefined) => {
      setFieldErrors((prev) => {
        const next = { ...prev };
        if (message === undefined) {
          delete next[key];
        } else {
          next[key] = message;
        }
        return next;
      });
    },
    [],
  );

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      setFieldErrors({});
      setFormError(null);

      if (validate) {
        const validationErrors = validate(valuesRef.current);
        if (Object.keys(validationErrors).length > 0) {
          setFieldErrors(validationErrors);
          return;
        }
      }

      setInternalSubmitting(true);
      try {
        const result = await submit(valuesRef.current);
        onSuccess?.(result);
      } catch (error) {
        handleFormMutationError(error, {
          onFieldErrors: (errors) =>
            setFieldErrors(errors as FormFieldErrors<TValues>),
          onFormError: setFormError,
          defaultFormError,
          mappers,
          handle409,
          handle404,
        });
      } finally {
        setInternalSubmitting(false);
      }
    },
    [
      validate,
      submit,
      onSuccess,
      mappers,
      handle409,
      handle404,
      defaultFormError,
    ],
  );

  return useMemo(
    () => ({
      values,
      setValue,
      reset,
      fieldErrors,
      setFieldError,
      formError,
      setFormError,
      isSubmitting: externalSubmitting || internalSubmitting,
      handleSubmit,
    }),
    [
      values,
      setValue,
      reset,
      fieldErrors,
      setFieldError,
      formError,
      externalSubmitting,
      internalSubmitting,
      handleSubmit,
    ],
  );
}
