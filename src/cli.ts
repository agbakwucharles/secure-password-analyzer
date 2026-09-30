#!/usr/bin/env node
import { stdin as input, stdout as output } from "node:process"
import { createInterface } from "node:readline/promises"
import { analyzePassword } from "./index.js"
const json = process.argv.includes("--json"); const useStdin = process.argv.includes("--stdin")
if (process.argv[2] !== "analyze") { output.write("Usage: password-analyzer analyze [--stdin] [--json]\n"); process.exitCode = 1 } else {
  const password = useStdin ? await readStdin() : await prompt()
  const result = analyzePassword(password)
  output.write(json ? `${JSON.stringify(result)}\n` : `Strength: ${result.rating}\nEntropy estimate: ${result.estimatedEntropyBits} bits\n\nFindings:\n${result.findings.map((item) => `- ${item.message}`).join("\n") || "- None"}\n\nRecommendations:\n${result.recommendations.map((item) => `- ${item}`).join("\n") || "- None"}\n`)
}
async function readStdin(): Promise<string> { let result = ""; for await (const chunk of input) result += chunk; return result.replace(/\r?\n$/, "") }
async function prompt(): Promise<string> { const terminal = createInterface({ input, output, terminal: true }); const result = await terminal.question("Password: "); terminal.close(); return result }
