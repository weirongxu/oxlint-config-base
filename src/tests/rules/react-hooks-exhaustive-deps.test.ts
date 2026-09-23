import '../setup.ts'
import dedent from 'dedent'
import { describe, expect, it } from 'vitest'

import { lintHelper } from '../helper.ts'

// In oxlint the react-hooks rules are reported with the `react-hooks/`
// code prefix.
// Note: the source ESLint preset emits this at warn; these configs
// deliberately escalate it to error (all categories at error).
describe('react-hooks-exhaustive-deps', () => {
  it('should error on missing dependency in useEffect', () => {
    const result = lintHelper.fromContent(
      dedent`
        import { useEffect, useState } from 'react'

        function App() {
          const [value, setValue] = useState(0);
          useEffect(() => {
            console.log(value)
          }, []);
          return <div>Hello</div>
        }
      `,
    )
    expect(result).toRuleCount(1, {
      rule: 'react-hooks(exhaustive-deps)',
    })
  })

  it('should not error when all dependencies are included', () => {
    const result = lintHelper.fromContent(
      dedent`
        import { useEffect, useState } from 'react'

        function App() {
          const [value, setValue] = useState(0);
          useEffect(() => {
            console.log(value)
          }, [value]);
          return <div>Hello</div>
        }
      `,
    )
    expect(result).toRuleCount(0, {
      rule: 'react-hooks(exhaustive-deps)',
    })
  })
})
