import '../setup.ts'
import { describe, expect, it } from 'vitest'
import dedent from 'dedent'
import { lintHelper } from '../helper.ts'

describe('require-await', () => {
  it('should allow async function without await (rule disabled)', () => {
    const result = lintHelper.fromContent(
      dedent`
        async function foo() {
          return Promise.resolve('value')
        }
      `,
    )
    expect(result).toRuleCount(0, {
      rule: 'eslint(no-async-promise-executor)',
    })
  })

  it('should allow async arrow function without await (rule disabled)', () => {
    const result = lintHelper.fromContent(
      dedent`
        async () => {
          return 'value'
        }
      `,
    )
    expect(result).toRuleCount(0, {
      rule: 'eslint(no-async-promise-executor)',
    })
  })
})
