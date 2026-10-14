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

### Tailwind CSS

Requires a Tailwind CSS v4 project (the plugin itself depends on `tailwindcss ^4.3.3`) and oxlint >= 1.43. `oxlint-tailwindcss` is a mandatory peer dependency installed automatically by npm 7+ / pnpm 8+.

oxlint.config.ts

```typescript
import { config, tailwindcss } from '@raidou/oxlint-config-base'
import { defineConfig } from 'oxlint'

export default defineConfig({
    env: { builtin: true, node: true },
    extends: [config],
    ...tailwindcss({ entryPoint: 'src/styles.css' }),
})
```

`entryPoint` must point to the CSS file containing `@import "tailwindcss"`. The settings are passed top-level because configs referenced via `extends` don't inherit `settings`.

### oxfmt

oxfmt.config.ts

```typescript
import { defineConfig } from 'oxfmt'
import { fmtconfig } from '@raidou/oxlint-config-base'

export default defineConfig(fmtconfig)
```
