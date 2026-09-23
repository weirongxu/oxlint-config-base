import '../setup.ts'
import dedent from 'dedent'
import { describe, expect, it } from 'vitest'

import { lintHelper } from '../helper.ts'

// In oxlint the react-hooks rules are reported with the `react-hooks/`
// code prefix.
describe('react-hooks-rules-of-hooks', () => {
  it('should error on conditional hook', () => {
    const result = lintHelper.fromContent(
      dedent`
        import { useEffect } from 'react'

        function App() {
          if (true) {
            useEffect(() => {}, [])
          }
        }
      `,
    )
    expect(result).toRuleCount(1, {
      rule: 'react-hooks(rules-of-hooks)',
    })
  })

  it('should pass with correct hook usage', () => {
    const result = lintHelper.fromContent(
      dedent`
        import { useEffect } from 'react'

        function App() {
          useEffect(() => {}, [])
        }
      `,
    )
    expect(result).toRuleCount(0, {
      rule: 'react-hooks(rules-of-hooks)',
    })
  })
})
