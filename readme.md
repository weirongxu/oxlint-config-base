# Personal Oxlint rules for Typescript

## Install

```
npm install -D @raidou/oxlint-config-base oxlint oxlint-tsgolint oxfmt
```

`oxlint-tsgolint` are declared as peer dependencies and installed automatically by npm 7+.

## Usage

### oxlint

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

### oxfmt

oxfmt.config.ts

```typescript
import { defineConfig } from 'oxfmt'
import { fmtconfig } from '@raidou/oxlint-config-base'

export default defineConfig(fmtconfig)
```
