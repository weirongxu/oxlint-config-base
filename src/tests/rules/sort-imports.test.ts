import '../setup.ts'
import { describe, expect, it } from 'vitest'
import dedent from 'dedent'
import { lintHelper } from '../helper.ts'

describe('sort-imports', () => {
  it('should error when imports are not sorted', () => {
    const result = lintHelper.fromContent(
      dedent`
        import { b } from 'beta'
        import { a } from 'alpha'
      `,
    )
    expect(result).toRuleCount(1, {
      rule: 'eslint(sort-imports)',
    })
  })

  it('should allow sorted imports', () => {
    const result = lintHelper.fromContent(
      dedent`
        import { a } from 'alpha'
        import { b } from 'beta'
      `,
    )
    expect(result).toRuleCount(0, {
      rule: 'eslint(sort-imports)',
    })
  })

  it('should error when named imports are not sorted alphabetically', () => {
    const result = lintHelper.fromContent(
      dedent`
        import { z, a, m } from 'module'
      `,
    )
    expect(result).toRuleCount(1, {
      rule: 'eslint(sort-imports)',
    })
  })

  it('should allow alphabetically sorted named imports', () => {
    const result = lintHelper.fromContent(
      dedent`
        import { a, m, z } from 'module'
      `,
    )
    expect(result).toRuleCount(0, {
      rule: 'eslint(sort-imports)',
    })
  })

  it('should error when type imports are not properly sorted with regular imports', () => {
    const result = lintHelper.fromContent(
      dedent`
        import { b } from 'beta'
        import type { C } from 'charlie'
        import { a } from 'alpha'
      `,
    )
    expect(result).toRuleCount(1, {
      rule: 'eslint(sort-imports)',
    })
  })

  // Divergence from simple-import-sort: oxlint's sort-imports only accepts
  // `import type` declarations placed before value imports within the same
  // group, so this ESLint-valid ordering is (mis)reported as unsorted. Kept
  // to document the upstream behavior; see also the note in index.ts.
  it('should report ESLint-valid type-import ordering as unsorted (upstream divergence)', () => {
    const result = lintHelper.fromContent(
      dedent`
        import { a } from 'alpha'
        import { b } from 'beta'
        import type { C } from 'charlie'
      `,
    )
    expect(result).toRuleCount(1, {
      rule: 'eslint(sort-imports)',
    })
  })
})
