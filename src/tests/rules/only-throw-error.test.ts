import '../setup.ts'
import { describe, expect, it } from 'vitest'
import dedent from 'dedent'
import { lintHelper } from '../helper.ts'

describe('only-throw-error', () => {
  it('should error on throwing string', () => {
    const result = lintHelper.fromContent(
      dedent`
        throw 'error message'
      `,
    )
    expect(result).toRuleCount(1, {
      rule: 'typescript(only-throw-error)',
    })
  })

  it('should error on throwing number', () => {
    const result = lintHelper.fromContent(
      dedent`
        throw 404
      `,
    )
    expect(result).toRuleCount(1, {
      rule: 'typescript(only-throw-error)',
    })
  })

  it('should error on throwing boolean', () => {
    const result = lintHelper.fromContent(
      dedent`
        throw true
      `,
    )
    expect(result).toRuleCount(1, {
      rule: 'typescript(only-throw-error)',
    })
  })

  it('should error on throwing object', () => {
    const result = lintHelper.fromContent(
      dedent`
        throw { code: 404, message: 'Not Found' }
      `,
    )
    expect(result).toRuleCount(1, {
      rule: 'typescript(only-throw-error)',
    })
  })

  it('should error on throwing null', () => {
    const result = lintHelper.fromContent(
      dedent`
        throw null
      `,
    )
    expect(result).toRuleCount(1, {
      rule: 'typescript(only-throw-error)',
    })
  })

  it('should error on throwing undefined', () => {
    const result = lintHelper.fromContent(
      dedent`
        throw undefined
      `,
    )
    expect(result).toRuleCount(1, {
      rule: 'typescript(only-throw-error)',
    })
  })

  it('should allow throwing Error', () => {
    const result = lintHelper.fromContent(
      dedent`
        throw new Error('error message')
      `,
    )
    expect(result).toRuleCount(0, {
      rule: 'typescript(only-throw-error)',
    })
  })

  it('should allow throwing TypeError', () => {
    const result = lintHelper.fromContent(
      dedent`
        throw new TypeError('type error')
      `,
    )
    expect(result).toRuleCount(0, {
      rule: 'typescript(only-throw-error)',
    })
  })

  it('should allow throwing RangeError', () => {
    const result = lintHelper.fromContent(
      dedent`
        throw new RangeError('range error')
      `,
    )
    expect(result).toRuleCount(0, {
      rule: 'typescript(only-throw-error)',
    })
  })

  it('should allow throwing custom Error class', () => {
    const result = lintHelper.fromContent(
      dedent`
        class CustomError extends Error {
          constructor(message: string) {
            super(message)
            this.name = 'CustomError'
          }
        }
        throw new CustomError('custom error')
      `,
    )
    expect(result).toRuleCount(0, {
      rule: 'typescript(only-throw-error)',
    })
  })

  it('should error on re-throwing non-Error', () => {
    const result = lintHelper.fromContent(
      dedent`
        try {
          // something
        } catch (e) {
          throw 'caught'
        }
      `,
    )
    expect(result).toRuleCount(1, {
      rule: 'typescript(only-throw-error)',
    })
  })
})
