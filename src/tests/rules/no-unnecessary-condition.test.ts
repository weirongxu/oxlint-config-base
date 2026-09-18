import '../setup.ts'
import { describe, expect, it } from 'vitest'
import dedent from 'dedent'
import { lintHelper } from '../helper.ts'

describe('no-unnecessary-condition', () => {
  it('should error on always true condition with literal', () => {
    const result = lintHelper.fromContent(
      dedent`
        if (true) {
          console.log('always true')
        }
      `,
    )
    expect(result).toRuleCount(1, {
      rule: 'typescript(no-unnecessary-condition)',
    })
  })

  it('should error on always false condition with literal', () => {
    const result = lintHelper.fromContent(
      dedent`
        if (false) {
          console.log('never true')
        }
      `,
    )
    expect(result).toRuleCount(1, {
      rule: 'typescript(no-unnecessary-condition)',
    })
  })

  it('should error on unnecessary null check on non-nullable type', () => {
    const result = lintHelper.fromContent(
      dedent`
        function test(value: string) {
          if (value === null) {
            console.log('never null')
          }
        }
      `,
    )
    expect(result).toRuleCount(1, {
      rule: 'typescript(no-unnecessary-condition)',
    })
  })

  it('should error on unnecessary undefined check on non-nullable type', () => {
    const result = lintHelper.fromContent(
      dedent`
        function test(value: string) {
          if (value === undefined) {
            console.log('never undefined')
          }
        }
      `,
    )
    expect(result).toRuleCount(1, {
      rule: 'typescript(no-unnecessary-condition)',
    })
  })

  it('should error on unnecessary truthy check on literal', () => {
    const result = lintHelper.fromContent(
      dedent`
        function test() {
          const value = 'hello'
          if (value) {
            console.log('always truthy')
          }
        }
      `,
    )
    expect(result).toRuleCount(1, {
      rule: 'typescript(no-unnecessary-condition)',
    })
  })

  it('should error on unnecessary falsy check on empty string literal', () => {
    const result = lintHelper.fromContent(
      dedent`
        function test() {
          const value = ''
          if (!value) {
            console.log('always falsy')
          }
        }
      `,
    )
    expect(result).toRuleCount(1, {
      rule: 'typescript(no-unnecessary-condition)',
    })
  })

  it('should allow condition with nullable type', () => {
    const result = lintHelper.fromContent(
      dedent`
        function test(value: string | null) {
          if (value === null) {
            console.log('might be null')
          }
        }
      `,
    )
    expect(result).toRuleCount(0, {
      rule: 'typescript(no-unnecessary-condition)',
    })
  })

  it('should allow condition with optional type', () => {
    const result = lintHelper.fromContent(
      dedent`
        function test(value: string | undefined) {
          if (value === undefined) {
            console.log('might be undefined')
          }
        }
      `,
    )
    expect(result).toRuleCount(0, {
      rule: 'typescript(no-unnecessary-condition)',
    })
  })

  it('should allow condition with variable', () => {
    const result = lintHelper.fromContent(
      dedent`
        function test(condition: boolean) {
          if (condition) {
            console.log('depends on runtime value')
          }
        }
      `,
    )
    expect(result).toRuleCount(0, {
      rule: 'typescript(no-unnecessary-condition)',
    })
  })

  it('should allow condition with type guard', () => {
    const result = lintHelper.fromContent(
      dedent`
        function test(value: string | number) {
          if (typeof value === 'string') {
            console.log('is string')
          }
        }
      `,
    )
    expect(result).toRuleCount(0, {
      rule: 'typescript(no-unnecessary-condition)',
    })
  })

  it('should allow condition after type narrowing', () => {
    const result = lintHelper.fromContent(
      dedent`
        function test(value: string | null) {
          if (value !== null) {
            if (value) {
              console.log('value is truthy')
            }
          }
        }
      `,
    )
    expect(result).toRuleCount(0, {
      rule: 'typescript(no-unnecessary-condition)',
    })
  })

  it('should error on redundant logical AND with literal', () => {
    const result = lintHelper.fromContent(
      dedent`
        function test() {
          const value = true
          if (value && true) {
            console.log('redundant')
          }
        }
      `,
    )
    expect(result).toRuleCount(2, {
      rule: 'typescript(no-unnecessary-condition)',
    })
  })

  it('should allow logical AND with two variables', () => {
    const result = lintHelper.fromContent(
      dedent`
        function test(a: boolean, b: boolean) {
          if (a && b) {
            console.log('both true')
          }
        }
      `,
    )
    expect(result).toRuleCount(0, {
      rule: 'typescript(no-unnecessary-condition)',
    })
  })

  it('should error on optional chaining on non-nullable type', () => {
    const result = lintHelper.fromContent(
      dedent`
        function test(value: string) {
          const result = value?.toLowerCase()
        }
      `,
    )
    expect(result).toRuleCount(1, {
      rule: 'typescript(no-unnecessary-condition)',
    })
  })

  it('should allow optional chaining on nullable type', () => {
    const result = lintHelper.fromContent(
      dedent`
        function test(value: string | null, value2: string | undefined) {
          const result = value?.toLowerCase()
          const result2 = value2?.toLowerCase()
        }
      `,
    )
    expect(result).toRuleCount(0, {
      rule: 'typescript(no-unnecessary-condition)',
    })
  })
})
