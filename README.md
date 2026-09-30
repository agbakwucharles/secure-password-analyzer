# secure-password-analyzer

A local-only password strength library and CLI. Passwords are never logged, stored, transmitted, or sent to a breach service.

```sh
password-analyzer analyze
password-analyzer analyze --stdin --json
```

Avoid command-line password arguments because shell history can retain them. The score combines length, character pool, and penalties for common passwords, substitutions, sequences, repeats, keyboard runs, and date-like strings. Entropy is an approximation, not a cracking-time prediction.

```ts
import { analyzePassword } from "secure-password-analyzer"
const result = analyzePassword("a long unique passphrase")
```
