import { describe, expect, it } from "vitest"
import { analyzePassword } from "../src/index.js"
describe("analyzePassword", () => { it("flags predictable inputs", () => { const result = analyzePassword("P@ssw0rd123"); expect(result.findings.some((finding) => finding.code === "common")).toBe(true); expect(result.score).toBeLessThan(3) }); it("supports Unicode", () => expect(analyzePassword("洞窟の青い月と静かな風🌙").estimatedEntropyBits).toBeGreaterThan(10)) })
