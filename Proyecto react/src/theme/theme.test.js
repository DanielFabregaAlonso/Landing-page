import { describe, expect, it } from "vitest";
import { theme } from "./theme";

describe("theme", () => {
  it("defines the brand and accent color palettes from the real logo colors", () => {
    expect(theme.colors.brand[500]).toBe("#2e7d4f");
    expect(theme.colors.accent[500]).toBe("#e8590c");
  });
});
