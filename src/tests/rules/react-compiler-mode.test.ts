import '../setup.ts'
import dedent from 'dedent'
import { defineConfig } from 'oxlint'
import { describe, expect, it } from 'vitest'

import { config, reactCompiler } from '../../index.ts'
import { lintHelper } from '../helper.ts'

const compilerConfig = defineConfig({ extends: [config, reactCompiler()] })

describe('react-compiler-mode', () => {
  it('should not fire compiler rules under the base config', () => {
    const result = lintHelper.fromContent(compilerViolations)
    expect(result).toRuleCount(0, {
      rule: 'react(preserve-manual-memoization)',
    })
    expect(result).toRuleCount(0, { rule: 'react(refs)' })
  })

  it('should fire compiler rules in compiler mode', () => {
    const result = lintHelper.fromContent(compilerViolations, {
      config: compilerConfig,
    })
    expect(result).toRuleCount(1, {
      rule: 'react(preserve-manual-memoization)',
    })
    expect(result).toRuleCount(1, { rule: 'react(refs)' })
  })

  it('should keep set-state-in-effect off in compiler mode', () => {
    const result = lintHelper.fromContent(
      dedent`
        import { useEffect, useState } from 'react'

        export function App() {
          const [state, setState] = useState(0)
          useEffect(() => { setState(1) }, [])
          return null
        }
      `,
      { config: compilerConfig },
    )
    expect(result).toRuleCount(0, { rule: 'react(set-state-in-effect)' })
  })
})

const compilerViolations = dedent`
  import { useCallback, useRef } from 'react'

  function useHook(): void {}
  function doSomething(): void {}
  function doSomethingElse(): void {}

  export function useFoo(props: number) {
    const x: number[] = []
    useHook()
    x.push(props)
    return useCallback(() => {
      doSomething()
      doSomethingElse()
      return [x]
    }, [x])
  }

  export function App() {
    const ref = useRef(0)
    return <div onClick={() => { ref.current += 1 }}>{ref.current}</div>
  }
`
