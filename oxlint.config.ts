import { defineConfig } from 'oxlint'

import { config } from './src/index.ts'

export default defineConfig({
  env: { builtin: true, node: true },
  ignorePatterns: ['dist/**', 'node_modules/**'],
  extends: [config],
})
