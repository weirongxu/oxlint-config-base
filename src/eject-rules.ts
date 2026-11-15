import { execFile } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import { promisify } from 'node:util'

import type { DummyRule, DummyRuleMap, OxlintConfig } from 'oxlint'
import { z } from 'zod'

const severitySchema = z.enum(['error', 'warn', 'off', 'deny', 'allow'])
const printedConfigSchema = z.object({
  rules: z.record(z.string(), severitySchema),
})

type EjectedConfig = {
  plugins: NonNullable<OxlintConfig['plugins']>
  options: OxlintConfig['options']
  rules: Record<string, DummyRule>
}

type PrintedRules = z.infer<typeof printedConfigSchema>['rules']

const RULE_URL_BASE = 'https://oxc.rs/docs/guide/usage/linter/rules'
const execFileAsync = promisify(execFile)
const packageRoot = path.join(import.meta.dirname, '..')
const oxlintBin = path.join(
  path.dirname(createRequire(import.meta.url).resolve('oxlint/package.json')),
  'bin',
  'oxlint',
)

function getRuleUrl(ruleName: string): string {
  const [plugin, rule] = ruleName.split('/')
  return rule === undefined
    ? `${RULE_URL_BASE}/eslint/${plugin}.html`
    : `${RULE_URL_BASE}/${plugin}/${rule}.html`
}

function sortRules(rules: DummyRuleMap): Record<string, DummyRule> {
  const sorted: Record<string, DummyRule> = {}
  for (const name of Object.keys(rules).sort()) {
    const rule = rules[name]
    if (rule !== undefined) sorted[name] = rule
  }
  return sorted
}

function configToJsonc({ rules, plugins, options }: EjectedConfig): string {
  const ruleLines = Object.entries(rules).map(
    ([ruleName, rule]) =>
      `    // ${getRuleUrl(ruleName)}\n    "${ruleName}": ${JSON.stringify(rule)}`,
  )

  const lines = ['{', `  "plugins": ${JSON.stringify(plugins)},`]
  if (options !== undefined) {
    lines.push(`  "options": ${JSON.stringify(options)},`)
  }
  lines.push('  "rules": {', ruleLines.join(',\n'), '  }', '}')

  return lines.join('\n')
}

async function saveTo(
  outputPath: string,
  ejectedConfig: EjectedConfig,
): Promise<void> {
  const dir = path.dirname(outputPath)
  await mkdir(dir, { recursive: true })
  await Promise.all([
    writeFile(`${outputPath}.jsonc`, configToJsonc(ejectedConfig)),
    writeFile(`${outputPath}.json`, JSON.stringify(ejectedConfig, null, 2)),
  ])
}

const ejectConfig = (
  config: OxlintConfig,
  printedRules: PrintedRules,
): EjectedConfig => {
  // NOTE: the printed output renames severities and flattens option tuples;
  // overlay the source rules to restore the original spellings and payloads.
  const rules: Record<string, DummyRule> = { ...printedRules }
  Object.assign(rules, config.rules)
  return {
    plugins: config.plugins ?? [],
    options: config.options,
    rules: sortRules(rules),
  }
}

export const ejectRules = async (
  config: OxlintConfig,
  outputPath: string,
): Promise<void> => {
  const { stdout } = await execFileAsync(oxlintBin, ['--print-config'], {
    cwd: packageRoot,
    encoding: 'utf8',
  })
  const printed = printedConfigSchema.parse(JSON.parse(stdout))
  await saveTo(outputPath, ejectConfig(config, printed.rules))
}

export const ejectModeRules = async (
  ...entries: readonly (readonly [OxlintConfig, string])[]
): Promise<void> => {
  await Promise.all(
    entries.map(([config, outputPath]) =>
      saveTo(outputPath, {
        plugins: config.plugins ?? [],
        options: config.options,
        rules: sortRules(config.rules ?? {}),
      }),
    ),
  )
}
