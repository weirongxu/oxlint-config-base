# Personal Oxlint rules for Typescript

## Install

```
npm install @raidou/oxlint-config-base oxlint oxlint-tsgolint oxfmt
```

## Usage

oxlint.config.ts

```typescript
import { config } from '@raidou/oxlint-config-base'
import { defineConfig } from 'oxlint'

export default defineConfig({
    env: { builtin: true, node: true },
    ignorePatterns: ['dist/**', 'node_modules/**'],
    extends: [config],
})
```
