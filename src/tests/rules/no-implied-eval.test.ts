import '../setup.ts'
import { describe, expect, it } from 'vitest'
import dedent from 'dedent'
import { lintHelper } from '../helper.ts'

// Note: the core `no-implied-eval` is explicitly off in jsRules; the
// type-aware `typescript/no-implied-eval` (kept on via categories) covers
// these cases.
describe('no-implied-eval', () => {
  it('should error on setTimeout with string', () => {
    const result = lintHelper.fromContent(
      dedent`
        setTimeout('console.log("test")', 1000)
      `,
    )
    expect(result).toRuleCount(1, {
      rule: 'typescript(no-implied-eval)',
    })
  })

  it('should error on setInterval with string', () => {
    const result = lintHelper.fromContent(
      dedent`
        setInterval('console.log("test")', 1000)
      `,
    )
    expect(result).toRuleCount(1, {
      rule: 'typescript(no-implied-eval)',
    })
  })

  it('should error on setImmediate with string', () => {
    const result = lintHelper.fromContent(
      dedent`
        setImmediate('console.log("test")')
      `,
    )
    expect(result).toRuleCount(1, {
      rule: 'typescript(no-implied-eval)',
    })
  })

  it('should allow setTimeout with function', () => {
    const result = lintHelper.fromContent(
      dedent`
        setTimeout(() => console.log('test'), 1000)
      `,
    )
    expect(result).toRuleCount(0, {
      rule: 'typescript(no-implied-eval)',
    })
  })

  it('should allow setInterval with function', () => {
    const result = lintHelper.fromContent(
      dedent`
        setInterval(() => console.log('test'), 1000)
      `,
    )
    expect(result).toRuleCount(0, {
      rule: 'typescript(no-implied-eval)',
    })
  })

  it('should allow setImmediate with function', () => {
    const result = lintHelper.fromContent(
      dedent`
        setImmediate(() => console.log('test'))
      `,
    )
    expect(result).toRuleCount(0, {
      rule: 'typescript(no-implied-eval)',
    })
  })
})
