import { ejectModeRules, ejectRules } from '../src/eject-rules.ts'
import { config, reactCompiler, tailwindcss } from '../src/index.ts'

const main = async (): Promise<void> => {
  await ejectRules(config, 'rules/config-rules')
  await ejectModeRules(
    [reactCompiler(), 'rules/config-rules-react-compiler'],
    [tailwindcss(), 'rules/config-rules-tailwindcss'],
  )
}

main().catch((err: unknown) => {
  console.error(err)
  process.exit(1)
})
