import type { DummyRuleMap } from 'oxlint'

export const reactRules: DummyRuleMap = {
  // --- React rules kept from the react-hooks preset ---
  // `react-hooks/rules-of-hooks` (error) and `react-hooks/exhaustive-deps`
  // (warn in ESLint, `react/exhaustive-deps` is correctness => error here).
  'react/rules-of-hooks': 'error',
  // oxlint-specific correctness rules with no counterpart in the ESLint
  // preset (React Compiler based); disabled to keep parity with the preset.
  'react/preserve-manual-memoization': 'off',
  'react/refs': 'off',
  'react/set-state-in-effect': 'off',
  // Present in the ESLint preset but disabled here on purpose.
  'react/no-array-index-key': 'off',
}
