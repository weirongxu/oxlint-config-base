import '../setup.ts'
import dedent from 'dedent'
import { describe, expect, it } from 'vitest'

import { lintHelper } from '../helper.ts'

describe('no-console', () => {
  it('should warn on console.log', () => {
    const result = lintHelper.fromContent(
      dedent`
        console.log('test')
        console.debug('test')
      `,
    )
    expect(result).toRuleCount(2, {
      rule: 'eslint(no-console)',
    })
  })

  it('should allow console.error', () => {
    const result = lintHelper.fromContent(
      dedent`
        console.error('test')
      `,
      { filename: 'fixture.ts' },
    )
    expect(result).toRuleCount(0, {
      rule: 'eslint(no-console)',
    })
  })

  it('should allow console.warn', () => {
    const result = lintHelper.fromContent(
      dedent`
        console.warn('test')
      `,
    )
    expect(result).toRuleCount(0, {
      rule: 'eslint(no-console)',
    })
  })

  it('should warn on console.info', () => {
    const result = lintHelper.fromContent(
      dedent`
        console.info('test')
      `,
    )
    expect(result).toRuleCount(1, {
      rule: 'eslint(no-console)',
    })
  })

  it('should allow console.assert', () => {
    const result = lintHelper.fromContent(
      dedent`
        console.assert(true, 'test')
        console.assert(false, 'error message')
      `,
    )
    expect(result).toRuleCount(0, {
      rule: 'eslint(no-console)',
    })
  })
})
