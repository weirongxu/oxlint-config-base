import '../setup.ts'
import { describe, expect, it } from 'vitest'
import dedent from 'dedent'
import { lintHelper } from '../helper.ts'

describe('no-async-promise-executor', () => {
  it('should error on async function in Promise executor', () => {
    const result = lintHelper.fromContent(
      dedent`
        void new Promise(async (resolve, reject) => {
          await Promise.resolve()
          resolve()
        })
      `,
    )
    expect(result).toRuleCount(1, {
      rule: 'eslint(no-async-promise-executor)',
    })
  })

  it('should allow non-async Promise executor', () => {
    const result = lintHelper.fromContent(
      dedent`
        void new Promise((resolve) => {
          resolve()
        })
      `,
    )
    expect(result).toRuleCount(0, {
      rule: 'eslint(no-async-promise-executor)',
    })
  })
})
