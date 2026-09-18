import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { config as baseConfig } from '../index.ts'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { tmpdir } from 'node:os'

const nodeModulesBin = path.resolve(
  import.meta.dirname,
  '../../node_modules/.bin',
)

export class LintResult {
  readonly rules: readonly string[]

  constructor(rules: readonly string[]) {
    this.rules = rules
  }

  ruleCount(rule: string): number {
    return this.rules.filter((r) => r === rule).length
  }
}

// Runtime validation instead of blind casts: oxlint's JSON output shape is
// an implementation detail, so fail loudly with a stdout prefix if it
// changes.
function parseRules(stdout: string): readonly string[] {
  const invalid = (what: string): Error =>
    new Error(
      `Unexpected oxlint JSON output (missing ${what}): ${stdout.slice(0, 200)}`,
    )
  const parsed: unknown = JSON.parse(stdout)
  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    !('diagnostics' in parsed)
  ) {
    throw invalid('diagnostics array')
  }
  const { diagnostics } = parsed
  if (!Array.isArray(diagnostics)) throw invalid('diagnostics array')
  return diagnostics.map((entry) => {
    if (
      typeof entry !== 'object' ||
      entry === null ||
      typeof entry.code !== 'string'
    ) {
      throw invalid('diagnostic.code')
    }
    // Match rules by the raw diagnostic code oxlint emits, e.g.
    // `typescript(no-floating-promises)` or `eslint(no-console)`.
    return entry.code
  })
}

export const lintHelper = {
  fromContent(
    content: string,
    { filename }: Readonly<{ filename?: string }> = {},
  ): LintResult {
    const dir = mkdtempSync(path.join(tmpdir(), 'oxlint-test-'))
    try {
      const resolvedFilename = filename ?? 'test.tsx'
      const snippet = content.endsWith('\n') ? content : `${content}\n`
      writeFileSync(path.join(dir, resolvedFilename), snippet)
      writeFileSync(
        path.join(dir, '.oxlintrc.json'),
        JSON.stringify(baseConfig),
      )

      const result = spawnSync(
        path.join(nodeModulesBin, 'oxlint'),
        ['--config', '.oxlintrc.json', '--format', 'json', resolvedFilename],
        { cwd: dir, encoding: 'utf8' },
      )
      // Exit code 0 = clean, 1 = diagnostics found; anything else is a crash.
      if (result.status !== 0 && result.status !== 1) {
        throw new Error(
          `oxlint failed (exit ${result.status}): ${result.stderr}`,
        )
      }
      return new LintResult(parseRules(result.stdout))
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  },
}

// Prepended to PATH so spawned oxlint runs resolve the `tsgolint` shim
// (required for type-aware rules) from this repo's devDependencies.
process.env.PATH = [nodeModulesBin, process.env.PATH]
  .filter((segment) => segment !== undefined)
  .join(':')
