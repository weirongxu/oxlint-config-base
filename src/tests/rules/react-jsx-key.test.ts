import '../setup.ts'
import { describe, expect, it } from 'vitest'
import dedent from 'dedent'
import { lintHelper } from '../helper.ts'

describe('react-jsx-key', () => {
  it('should error on missing key in array map', () => {
    const result = lintHelper.fromContent(
      dedent`
        const items = ['a', 'b', 'c']
        items.map(item => <span>{item}</span>)
      `,
    )
    expect(result).toRuleCount(1, {
      rule: 'react(jsx-key)',
    })
  })

  it('should not error when key is provided in array map', () => {
    const result = lintHelper.fromContent(
      dedent`
        const items = ['a', 'b', 'c']
        items.map(item => <span key={item}>{item}</span>)
      `,
    )
    expect(result).toRuleCount(0, {
      rule: 'react(jsx-key)',
    })
  })

  it('should error on missing key in JSX fragment array', () => {
    const result = lintHelper.fromContent(
      dedent`
        <>{[<span>a</span>, <span>b</span>, <span>c</span>]}</>
      `,
    )
    expect(result).toRuleCount(3, {
      rule: 'react(jsx-key)',
    })
  })

  it('should not error when key is provided in JSX fragment array', () => {
    const result = lintHelper.fromContent(
      dedent`
        <>{[<span key="a">a</span>, <span key="b">b</span>, <span key="c">c</span>]}</>
      `,
    )
    expect(result).toRuleCount(0, {
      rule: 'react(jsx-key)',
    })
  })
})
