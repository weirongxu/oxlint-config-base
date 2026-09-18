import '../setup.ts'
import { describe, expect, it } from 'vitest'
import dedent from 'dedent'
import { lintHelper } from '../helper.ts'

describe('no-useless-rename', () => {
  it('should error on useless destructuring rename', () => {
    const result = lintHelper.fromContent(
      dedent`
        const { foo: foo } = obj
      `,
    )
    expect(result).toRuleCount(1, {
      rule: 'eslint(no-useless-rename)',
    })
  })

  it('should allow meaningful destructuring rename', () => {
    const result = lintHelper.fromContent(
      dedent`
        const { foo: bar } = obj
      `,
    )
    expect(result).toRuleCount(0, {
      rule: 'eslint(no-useless-rename)',
    })
  })
})
