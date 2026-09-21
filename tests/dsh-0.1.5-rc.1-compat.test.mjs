import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const [srcConfig, libConfig, packageJsonText] = await Promise.all([
  readFile(new URL('../src/config.ts', import.meta.url), 'utf8'),
  readFile(new URL('../lib/config.js', import.meta.url), 'utf8'),
  readFile(new URL('../package.json', import.meta.url), 'utf8'),
])

const packageJson = JSON.parse(packageJsonText)

assert.equal(
  srcConfig.includes('settingsNamespace('),
  false,
  'src/config.ts must not call the removed DSH settingsNamespace() runtime helper',
)
assert.equal(
  srcConfig.includes("from '@deepseek-ai/dsh-settings'"),
  false,
  'src/config.ts must not import the removed settingsNamespace runtime helper',
)
assert.match(
  srcConfig,
  /COT_SUMMARIZER_SETTINGS_NAMESPACE\s*=\s*'cot-summarizer'\s+as const/,
  'source namespace should be the literal accepted by DSH 0.1.5-rc.1 settings.register()',
)

assert.equal(
  libConfig.includes('settingsNamespace('),
  false,
  'lib/config.js must not call the removed DSH settingsNamespace() runtime helper',
)
assert.equal(
  libConfig.includes("from '@deepseek-ai/dsh-settings'"),
  false,
  'built runtime must not import the removed settingsNamespace helper',
)
assert.match(
  libConfig,
  /COT_SUMMARIZER_SETTINGS_NAMESPACE\s*=\s*'cot-summarizer'/,
  'built runtime namespace should be a plain literal',
)

for (const name of [
  '@deepseek-ai/dsh-client-locale',
  '@deepseek-ai/dsh-client-runtime',
  '@deepseek-ai/dsh-client-ui-settings',
  '@deepseek-ai/dsh-client-ui-slots',
  '@deepseek-ai/dsh-host-webserver',
  '@deepseek-ai/dsh-llm',
  '@deepseek-ai/dsh-session',
  '@deepseek-ai/dsh-settings',
]) {
  assert.equal(
    packageJson.peerDependencies[name],
    '>=0.1.5-rc.1 <0.2.0-0',
    `${name} peer range must explicitly admit DSH 0.1.5-rc.1`,
  )
}

console.log('DSH 0.1.5-rc.1 compatibility checks passed')
