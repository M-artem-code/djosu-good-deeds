import { describe, expect, it } from "vitest";
import {
  getApiErrorMessage,
  getApiErrorStatus,
  getApiMessage,
  isApiErrorWithData,
} from "./errors";

describe("lib/api/errors", () => {
  it("getApiMessage returns first string from array message", () => {
    const error = { status: 400, data: { message: ["a", "b"] } };
    expect(getApiMessage(error)).toBe("a");
  });

  it("getApiMessage returns string message", () => {
    const error = { status: 409, data: { message: "Already friends" } };
    expect(getApiMessage(error)).toBe("Already friends");
  });

  it("getApiMessage returns null when message missing", () => {
    expect(getApiMessage({ status: 500, data: {} })).toBeNull();
    expect(getApiMessage(null)).toBeNull();
  });

  it("isApiErrorWithData and getApiErrorStatus", () => {
    const error = { status: 401, data: { message: "Unauthorized" } };
    expect(isApiErrorWithData(error)).toBe(true);
    expect(getApiErrorStatus(error)).toBe(401);
  });

  it("getApiErrorMessage returns raw message field", () => {
    const error = { data: { message: ["x"] } };
    expect(getApiErrorMessage(error)).toEqual(["x"]);
  });
});
