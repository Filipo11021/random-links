import assert from "node:assert/strict";
import { describe, it } from "node:test";
import app from "./index.js";

describe("Health check", () => {
  it("Should return 200 response", async () => {
    const res = await app.request("/up", {}, { CORS_ORIGINS: "*" });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(await res.text(), "OK");
  });
});
