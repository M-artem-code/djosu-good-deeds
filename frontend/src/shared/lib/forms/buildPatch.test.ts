import { describe, expect, it } from "vitest";
import { buildPatch } from "./buildPatch";

describe("buildPatch", () => {
  it("returns only changed fields", () => {
    const patch = buildPatch(
      { name: "new", tag: "same" },
      { name: "old", tag: "same" },
    );
    expect(patch).toEqual({ name: "new" });
  });

  it("returns empty object when nothing changed", () => {
    expect(buildPatch({ a: 1, b: 2 }, { a: 1, b: 2 })).toEqual({});
  });
});
