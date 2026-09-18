import '../setup.ts'
import { describe, expect, it } from 'vitest'
import dedent from 'dedent'
import { lintHelper } from '../helper.ts'

describe('no-misused-promises', () => {
  it('should error on promise-returning function in if statement', () => {
    const result = lintHelper.fromContent(
      dedent`
        async function returnsPromise(): Promise<boolean> {
          return true
        }

        function test() {
          if (returnsPromise()) {}
        }
      `,
    )
    expect(result).toRuleCount(1, {
      rule: 'typescript(no-misused-promises)',
    })
  })

  it('should error on async arrow function in forEach', () => {
    const result = lintHelper.fromContent(
      dedent`
        function test() {
          const items = [1, 2, 3]
          items.forEach(async (item) => {
            await Promise.resolve(item)
          })
        }
      `,
    )
    expect(result).toRuleCount(1, {
      rule: 'typescript(no-misused-promises)',
    })
  })

  it('should allow await in if statement', () => {
    const result = lintHelper.fromContent(
      dedent`
        async function returnsPromise(): Promise<boolean> {
          return true
        }

        async function test() {
          if (await returnsPromise()) {}
        }
      `,
    )
    expect(result).toRuleCount(0, {
      rule: 'typescript(no-misused-promises)',
    })
  })

  it('should allow promise-returning function in array methods', () => {
    const result = lintHelper.fromContent(
      dedent`
        async function test() {
          const items = [1, 2, 3]
          items.map(async (item) => item * 2)
        }
      `,
    )
    expect(result).toRuleCount(0, {
      rule: 'typescript(no-misused-promises)',
    })
  })
})
