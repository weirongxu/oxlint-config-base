import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

import { ejectRules } from './eject-rules.ts'
import { config } from './index.ts'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const readJson = (filePath: string): Record<string, unknown> => {
  const parsed: unknown = JSON.parse(readFileSync(filePath, 'utf8'))
  if (!isRecord(parsed)) {
    throw new TypeError(`Unexpected JSON in ${filePath}: not a plain object`)
  }
  return parsed
}

const getRules = ({
  rules,
}: Record<string, unknown>): Record<string, unknown> => {
  if (!isRecord(rules)) {
    throw new TypeError('Ejected config has no rules object')
  }
  return rules
}

// Parses a `.jsonc` artifact: drops whole-line `//` comments first so the
// remainder must be valid JSON.
const parseJsonc = (filePath: string): unknown => {
  const jsonc = readFileSync(filePath, 'utf8')
  const stripped = jsonc
    .split('\n')
    .filter((line) => !line.trimStart().startsWith('//'))
    .join('\n')
  return JSON.parse(stripped)
}

// Runs the callback with a fresh temp directory, always cleaning it up.
const withTempDir = async (
  run: (dir: string) => Promise<void>,
): Promise<void> => {
  const dir = mkdtempSync(path.join(tmpdir(), 'eject-rules-'))
  try {
    await run(dir)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

describe('ejectRules', () => {
  it('expands categories and overlays explicit rules from the source config', async () => {
    await withTempDir(async (dir) => {
      const outputPath = path.join(dir, 'rules')
      await ejectRules(config, outputPath)
      const ejected = readJson(`${outputPath}.json`)
      expect(ejected.plugins).toEqual(config.plugins)
      expect(ejected.options).toEqual(config.options)
      // Explicit rules win over the category expansion and pass through
      // verbatim.
      const ejectedRules = getRules(ejected)
      for (const [name, rule] of Object.entries(config.rules ?? {})) {
        expect(ejectedRules[name]).toEqual(rule)
      }
    })
  })

  it('sorts rule keys alphabetically', async () => {
    await withTempDir(async (dir) => {
      const outputPath = path.join(dir, 'rules')
      await ejectRules(
        {
          plugins: ['eslint'],
          rules: {
            'no-console': 'warn',
            'no-var': 'error',
            'guard-for-in': 'off',
          },
        },
        outputPath,
      )
      const keys = Object.keys(getRules(readJson(`${outputPath}.json`)))
      expect(keys).toEqual([...keys].toSorted())
      // The source rules must appear in sorted order among the rules the
      // binary prints for the package-root config.
      const noConsoleIndex = keys.indexOf('no-console')
      const noVarIndex = keys.indexOf('no-var')
      const guardForInIndex = keys.indexOf('guard-for-in')
      expect(noConsoleIndex).toBeGreaterThan(-1)
      expect(noVarIndex).toBeGreaterThan(noConsoleIndex)
      expect(guardForInIndex).toBeGreaterThan(-1)
    })
  })

  it('drops explicit undefined rule values', async () => {
    await withTempDir(async (dir) => {
      const outputPath = path.join(dir, 'rules')
      await ejectRules(
        { plugins: ['eslint'], rules: { 'guard-for-in': undefined } },
        outputPath,
      )
      expect(getRules(readJson(`${outputPath}.json`))).not.toHaveProperty(
        'guard-for-in',
      )
    })
  })

  it('omits the options field when the input has none', async () => {
    await withTempDir(async (dir) => {
      const outputPath = path.join(dir, 'rules')
      await ejectRules({ plugins: ['eslint'], rules: {} }, outputPath)
      expect(readJson(`${outputPath}.json`)).not.toHaveProperty('options')
    })
  })
})

describe('ejectRules output paths', () => {
  it('writes a JSONC file with rule URL comments that parses once comments are stripped', async () => {
    await withTempDir(async (dir) => {
      const outputPath = path.join(dir, 'rules')
      await ejectRules(
        {
          plugins: ['eslint'],
          options: { typeAware: true },
          rules: { 'guard-for-in': 'error', 'react/exhaustive-deps': 'error' },
        },
        outputPath,
      )
      const jsonc = readFileSync(`${outputPath}.jsonc`, 'utf8')
      expect(jsonc).toContain(
        '// https://oxc.rs/docs/guide/usage/linter/rules/eslint/guard-for-in.html',
      )
      expect(jsonc).toContain(
        '// https://oxc.rs/docs/guide/usage/linter/rules/react/exhaustive-deps.html',
      )
      const parsed = parseJsonc(`${outputPath}.jsonc`)
      if (!isRecord(parsed)) {
        throw new TypeError('Ejected JSONC is not a plain object')
      }
      expect(parsed.plugins).toEqual(['eslint'])
      expect(parsed.options).toEqual({ typeAware: true })
      const rules = getRules(parsed)
      expect(rules['guard-for-in']).toBe('error')
      expect(rules['react/exhaustive-deps']).toBe('error')
    })
  })

  it('creates nested output directories', async () => {
    await withTempDir(async (dir) => {
      const outputPath = path.join(dir, 'deeply', 'nested', 'rules')
      await ejectRules(
        { plugins: ['eslint'], rules: { 'guard-for-in': 'error' } },
        outputPath,
      )
      expect(getRules(readJson(`${outputPath}.json`))['guard-for-in']).toBe(
        'error',
      )
    })
  })
})

describe('ejected rules/config-rules.json', () => {
  const ejectedPath = path.join(
    import.meta.dirname,
    '..',
    'rules',
    'config-rules.json',
  )
  const ejected = readJson(ejectedPath)

  it('is a full config with no category-only or unresolved fields', () => {
    for (const field of [
      'categories',
      'env',
      'globals',
      'ignorePatterns',
      'settings',
    ]) {
      expect(ejected).not.toHaveProperty(field)
    }
    expect(Array.isArray(ejected.plugins)).toBe(true)
  })

  it('keeps typeAware enabled', () => {
    const { options } = ejected
    if (!isRecord(options)) {
      throw new TypeError('Ejected config has no options object')
    }
    expect(options.typeAware).toBe(true)
  })

  it('expands category-driven rules like react/exhaustive-deps', () => {
    expect(getRules(ejected)['react/exhaustive-deps']).toBe('deny')
  })

  it('keeps explicit option tuples verbatim', () => {
    expect(getRules(ejected)['no-console']).toEqual([
      'warn',
      { allow: ['assert', 'warn', 'error'] },
    ])
  })

  // Guards against stale artifacts: the committed file must equal a fresh
  // regeneration driven by the current `src/index.ts`.
  it('matches a fresh regeneration from the current source config', async () => {
    await withTempDir(async (dir) => {
      await ejectRules(config, path.join(dir, 'config-rules'))
      // Compare parsed JSON: the committed artifact is re-formatted by oxfmt
      // after ejection, so the raw text differs in layout only.
      expect(readJson(`${dir}/config-rules.json`)).toEqual(
        readJson(ejectedPath),
      )
    })
  })
})
