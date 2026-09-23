import '../setup.ts'
import dedent from 'dedent'
import { describe, expect, it } from 'vitest'

import { lintHelper } from '../helper.ts'

describe('react-no-array-index-key', () => {
  // Behavior change vs the source ESLint react package: that test asserted
  // no diagnostic because the rule was not enabled there. In the config
  // all categories (including restriction, where react/no-array-index-key
  // lives) are escalated to error, so the rule fires.
  it('should error when using array index as key', () => {
    const result = lintHelper.fromContent(
      dedent`
        const items = ['a', 'b', 'c']
        items.map((item, index) => <span key={index}>{item}</span>)
      `,
    )
    expect(result).toRuleCount(1, {
      rule: 'react(no-array-index-key)',
    })
  })
})
