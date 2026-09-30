export type Rating = "very weak" | "weak" | "fair" | "good" | "strong"
export interface Finding { code: string; message: string; severity: "low" | "medium" | "high" }
export interface PasswordAnalysis { score: number; rating: Rating; estimatedEntropyBits: number; findings: Finding[]; recommendations: string[] }
const common = new Set(["password", "password1", "123456", "12345678", "qwerty", "letmein", "admin", "welcome", "p@ssw0rd"])
const keyboard = ["qwerty", "asdf", "zxcv", "12345", "98765"]
const normalize = (value: string) => value.toLowerCase().replaceAll("@", "a").replaceAll("0", "o").replaceAll("1", "i").replaceAll("3", "e").replaceAll("$", "s")
export function analyzePassword(password: string): PasswordAnalysis {
  const findings: Finding[] = []; const normalized = normalize(password); let pool = 0
  if (/[a-z]/.test(password)) pool += 26
  if (/[A-Z]/.test(password)) pool += 26
  if (/\d/.test(password)) pool += 10
  if (/[^\p{L}\p{N}\s]/u.test(password)) pool += 33
  if (/\s/u.test(password)) pool += 1
  if (password.length < 12) findings.push({ code: "short", message: "Password is shorter than 12 characters", severity: "high" })
  if (pool < 60) findings.push({ code: "limited-diversity", message: "Uses a limited set of character types", severity: "medium" })
  const withoutTrailingDigits = password.toLowerCase().replace(/\d+$/, "")
  if (common.has(password.toLowerCase()) || common.has(normalized) || common.has(withoutTrailingDigits) || common.has(normalize(withoutTrailingDigits))) findings.push({ code: "common", message: "Matches a common or commonly substituted password", severity: "high" })
  if (/(.)\1{2,}/u.test(password)) findings.push({ code: "repeated-character", message: "Contains repeated characters", severity: "medium" })
  if (/(.{2,})\1{2,}/u.test(password)) findings.push({ code: "repeated-sequence", message: "Contains a repeated sequence", severity: "medium" })
  if (keyboard.some((pattern) => normalized.includes(pattern) || normalized.includes([...pattern].reverse().join("")))) findings.push({ code: "keyboard", message: "Contains a common keyboard pattern", severity: "high" })
  if (/(19|20)\d{2}/.test(password)) findings.push({ code: "year", message: "Contains a predictable year-like pattern", severity: "low" })
  if (hasSequence(normalized)) findings.push({ code: "sequence", message: "Contains a simple sequential pattern", severity: "medium" })
  const entropy = password.length * Math.log2(Math.max(pool, 1)) - findings.reduce((penalty, finding) => penalty + (finding.severity === "high" ? 20 : finding.severity === "medium" ? 10 : 4), 0)
  const bits = Math.max(0, Math.round(entropy)); const score = bits < 20 ? 0 : bits < 35 ? 1 : bits < 50 ? 2 : bits < 70 ? 3 : bits < 90 ? 4 : 5
  const rating: Rating[] = ["very weak", "weak", "fair", "good", "strong", "strong"]
  const recommendations = [...new Set([password.length < 16 ? "Use a longer passphrase with at least 16 characters" : "", findings.length ? "Avoid common words, sequences, dates, and repetition" : "", pool < 60 ? "Mix character types where it is practical" : ""].filter(Boolean))]
  return { score, rating: rating[score], estimatedEntropyBits: bits, findings, recommendations }
}
function hasSequence(value: string): boolean { for (let index = 0; index < value.length - 2; index++) { const a = value.charCodeAt(index); const b = value.charCodeAt(index + 1); const c = value.charCodeAt(index + 2); if (b - a === c - b && Math.abs(b - a) === 1) return true } return false }
