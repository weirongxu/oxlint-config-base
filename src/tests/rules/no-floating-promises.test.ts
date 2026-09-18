import '../setup.ts'
import { describe, expect, it } from 'vitest'
import dedent from 'dedent'
import { lintHelper } from '../helper.ts'

describe('no-floating-promises', () => {
  it('should error on floating promise without handling', () => {
    const result = lintHelper.fromContent(
      dedent`
        Promise.resolve('value')
      `,
    )
    expect(result).toRuleCount(1, {
      rule: 'typescript(no-floating-promises)',
    })
  })

  it('should allow handled promise with await', () => {
    const result = lintHelper.fromContent(
      dedent`
        async function test() {
          await Promise.resolve('value')
        }
      `,
    )
    expect(result).toRuleCount(0, {
      rule: 'typescript(no-floating-promises)',
    })
  })

  it('should allow handled promise with catch', () => {
    const result = lintHelper.fromContent(
      dedent`
        Promise.resolve('value').catch(console.error)
      `,
    )
    expect(result).toRuleCount(0, {
      rule: 'typescript(no-floating-promises)',
    })
  })

  it('should allow returned promise', () => {
    const result = lintHelper.fromContent(
      dedent`
        function test() {
          return Promise.resolve('value')
        }
      `,
    )
    expect(result).toRuleCount(0, {
      rule: 'typescript(no-floating-promises)',
    })
  })

  it('should error on floating promise in function', () => {
    const result = lintHelper.fromContent(
      dedent`
        function test() {
          Promise.resolve('value')
        }
      `,
    )
    expect(result).toRuleCount(1, {
      rule: 'typescript(no-floating-promises)',
    })
  })

  it('should allow void expression with promise', () => {
    const result = lintHelper.fromContent(
      dedent`
        void Promise.resolve('value')
      `,
    )
    expect(result).toRuleCount(0, {
      rule: 'typescript(no-floating-promises)',
    })
  })
})
