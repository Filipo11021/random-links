import assert from "node:assert";
import { describe, it } from "node:test";
import { parseApplyMigrationsTarget } from "./apply-migrations";

describe("parse apply migrations target", () => {
  it("should return the correct target when the target is valid", () => {
    const localTargetResult = parseApplyMigrationsTarget("--local");
    const remoteTargetResult = parseApplyMigrationsTarget("--remote");

    if (!localTargetResult.success) {
      assert.fail("Expected local target to be valid");
    }
    assert.equal(localTargetResult.value, "local");

    if (!remoteTargetResult.success) {
      assert.fail("Expected remote target to be valid");
    }
    assert.equal(remoteTargetResult.value, "remote");
  });

  it("should return the correct target when the target is invalid", () => {
    const target = parseApplyMigrationsTarget("--invalid");
    if (!target.success) {
      assert.ok(target.error, "Expected target to be invalid");
    } else {
      assert.fail("Expected target to be invalid");
    }
  });
});
