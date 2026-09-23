import '../setup.ts'
import dedent from 'dedent'
import { describe, expect, it } from 'vitest'

import { lintHelper } from '../helper.ts'

describe('prefer-template', () => {
  it('should error on string concatenation', () => {
    const result = lintHelper.fromContent(
      dedent`
        const name = 'World'
        const message = 'Hello ' + name + '!'
      `,
    )
    expect(result).toRuleCount(1, {
      rule: 'eslint(prefer-template)',
    })
  })

  it('should allow template literals', () => {
    const result = lintHelper.fromContent(
      dedent`
        const name = 'World'
        const message = \`Hello \${name}!\`
      `,
    )
    expect(result).toRuleCount(0, {
      rule: 'eslint(prefer-template)',
    })
  })
})
