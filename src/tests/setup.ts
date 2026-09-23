import { expect } from 'vitest'

import type { LintResult } from './helper.ts'

type CustomMatchers = {
  toRuleCount: (count: number, options: { rule: string }) => void
}

declare module 'vitest' {
  interface Assertion extends CustomMatchers {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}

expect.extend({
  toRuleCount(received: LintResult, count: number, { rule }: { rule: string }) {
    const actualCount = received.ruleCount(rule)
    const pass = actualCount === count

    return {
      pass,
      message: () => {
        const plural = count === 1 ? '' : 's'
        return `Expected rule "${rule}" to have ${count} violation${plural}, but got ${actualCount}`
      },
    }
  },
})
