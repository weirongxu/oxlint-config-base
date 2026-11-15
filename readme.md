# Personal Oxlint rules for Typescript

## Install

```
npm install -D @raidou/oxlint-config-base oxlint oxfmt
```

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

oxlint.config.ts

```typescript
import { config, tailwindcss } from '@raidou/oxlint-config-base'
import { defineConfig } from 'oxlint'

export default defineConfig({
    env: { builtin: true, node: true },
    settings: { tailwindcss: { entryPoint: 'src/styles.css' } },
    extends: [config, tailwindcss()],
})
```

### React Compiler

oxlint.config.ts

```typescript
import { config, reactCompiler } from '@raidou/oxlint-config-base'
import { defineConfig } from 'oxlint'

export default defineConfig({
    env: { builtin: true, node: true },
    extends: [config, reactCompiler()],
})
```

### oxfmt

oxfmt.config.ts

```typescript
import { fmtconfig } from '@raidou/oxlint-config-base'
import { defineConfig } from 'oxfmt'

export default defineConfig(fmtconfig)
```
