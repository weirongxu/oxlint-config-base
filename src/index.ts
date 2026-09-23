import type { FormatConfig } from 'oxfmt'
import { type OxlintConfig, defineConfig } from 'oxlint'

import { eslintRules } from './rules/eslint.ts'
import { reactRules } from './rules/react.ts'
import { typescriptRules } from './rules/typescript.ts'

export const config: OxlintConfig = defineConfig({
  plugins: ['eslint', 'unicorn', 'typescript', 'oxc', 'react', 'import'],
  options: { typeAware: true },
  categories: {
    correctness: 'error',
  },
  rules: {
    ...typescriptRules,
    ...eslintRules,
    ...reactRules,
  },
})

export const fmtconfig: FormatConfig = {
  sortImports: true,
  printWidth: 80,
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
}

export type { FormatConfig } from 'oxfmt'
export type { OxlintConfig } from 'oxlint'
