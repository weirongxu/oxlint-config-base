import { config } from '../src/index.ts'
import { ejectRules } from '../src/eject-rules.ts'

const main = async (): Promise<void> => {
  await ejectRules(config, 'rules/config-rules')
}

main().catch((err: unknown) => {
  console.error(err)
  process.exit(1)
})
