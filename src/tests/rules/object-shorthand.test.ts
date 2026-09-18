import '../setup.ts'
import { describe, expect, it } from 'vitest'
import dedent from 'dedent'
import { lintHelper } from '../helper.ts'

describe('object-shorthand', () => {
  it('should error when not using shorthand', () => {
    const result = lintHelper.fromContent(
      dedent`
        const obj = { name: name }
      `,
    )
    expect(result).toRuleCount(1, {
      rule: 'eslint(object-shorthand)',
    })
  })

  it('should allow shorthand syntax', () => {
    const result = lintHelper.fromContent(
      dedent`
        const obj = { name }
      `,
    )
    expect(result).toRuleCount(0, {
      rule: 'eslint(object-shorthand)',
    })
  })
})
