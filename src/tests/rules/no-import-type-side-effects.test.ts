import '../setup.ts'
import { describe, expect, it } from 'vitest'
import dedent from 'dedent'
import { lintHelper } from '../helper.ts'

describe('no-import-type-side-effects', () => {
  it('should error on inline type only import', () => {
    const result = lintHelper.fromContent(
      dedent`
        import { type A } from './types';
      `,
    )
    expect(result).toRuleCount(1, {
      rule: 'typescript(no-import-type-side-effects)',
    })
  })

  it('should error on multiple inline type imports', () => {
    const result = lintHelper.fromContent(
      dedent`
        import { type A, type B } from './types';
      `,
    )
    expect(result).toRuleCount(1, {
      rule: 'typescript(no-import-type-side-effects)',
    })
  })

  it('should allow top-level type import', () => {
    const result = lintHelper.fromContent(
      dedent`
        import type { A } from './types';
      `,
    )
    expect(result).toRuleCount(0, {
      rule: 'typescript(no-import-type-side-effects)',
    })
  })

  it('should allow top-level type import with multiple types', () => {
    const result = lintHelper.fromContent(
      dedent`
        import type { A, B } from './types';
      `,
    )
    expect(result).toRuleCount(0, {
      rule: 'typescript(no-import-type-side-effects)',
    })
  })

  it('should allow mixed value and type import', () => {
    const result = lintHelper.fromContent(
      dedent`
        import { A, type B } from './module';
      `,
    )
    expect(result).toRuleCount(0, {
      rule: 'typescript(no-import-type-side-effects)',
    })
  })

  it('should allow value-only import', () => {
    const result = lintHelper.fromContent(
      dedent`
        import { A } from './module';
      `,
    )
    expect(result).toRuleCount(0, {
      rule: 'typescript(no-import-type-side-effects)',
    })
  })

  it('should allow default import', () => {
    const result = lintHelper.fromContent(
      dedent`
        import A from './module';
      `,
    )
    expect(result).toRuleCount(0, {
      rule: 'typescript(no-import-type-side-effects)',
    })
  })

  it('should allow default type import', () => {
    const result = lintHelper.fromContent(
      dedent`
        import type A from './types';
      `,
    )
    expect(result).toRuleCount(0, {
      rule: 'typescript(no-import-type-side-effects)',
    })
  })

  it('should error on inline type import with side-effect import', () => {
    const result = lintHelper.fromContent(
      dedent`
        import './side-effect';
        import { type A } from './types';
      `,
    )
    expect(result).toRuleCount(1, {
      rule: 'typescript(no-import-type-side-effects)',
    })
  })
})
