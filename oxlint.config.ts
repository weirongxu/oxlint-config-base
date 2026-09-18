import { config } from './src/index.ts'
import { defineConfig } from 'oxlint'

export default defineConfig({
  env: { builtin: true, node: true },
  ignorePatterns: ['dist/**', 'node_modules/**'],
  extends: [config],
})
