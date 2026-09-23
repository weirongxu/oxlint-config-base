import '../setup.ts'
import dedent from 'dedent'
import { describe, expect, it } from 'vitest'

import { lintHelper } from '../helper.ts'

describe('guard-for-in', () => {
  it('should error on for...in without if guard', () => {
    const result = lintHelper.fromContent(
      dedent`
        for (const key in obj) {
          console.log(key);
        }
      `,
    )
    expect(result).toRuleCount(1, {
      rule: 'eslint(guard-for-in)',
    })
  })

  it('should allow for...in with if guard', () => {
    const result = lintHelper.fromContent(
      dedent`
        for (const key in obj) {
          if (Object.hasOwn(obj, key)) {
            console.log(key);
          }
        }
      `,
    )
    expect(result).toRuleCount(0, {
      rule: 'eslint(guard-for-in)',
    })
  })
})
