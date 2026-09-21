# DSH 0.1.5-rc.1 compatibility

This fork contains a compatibility patch for DeepSeek Harness **0.1.5-rc.1**.

## Why the upstream 0.3.0 build fails

DSH 0.1.5-rc.1 no longer exports the runtime helper `settingsNamespace` from
`@deepseek-ai/dsh-settings`.

The upstream plugin used:

```ts
import { settingsNamespace } from '@deepseek-ai/dsh-settings'
export const COT_SUMMARIZER_SETTINGS_NAMESPACE = settingsNamespace('cot-summarizer')
```

which causes the plugin loader to fail before the plugin can start.

DSH 0.1.5-rc.1 validates the namespace inside `ctx.settings.register()`, so
the compatible form is a literal:

```ts
export const COT_SUMMARIZER_SETTINGS_NAMESPACE = 'cot-summarizer' as const
```

## Compatibility target

- DeepSeek Harness: `0.1.5-rc.1`
- Plugin fork version: `0.3.1-dsh015rc1.0`
- Node runtime: compatible with the plugin's existing ES module target
- Existing plugin behavior is unchanged apart from the settings namespace API adaptation.

## Verification

Run:

```sh
npm run compat:check
```

For a full source build/test environment:

```sh
pnpm install
pnpm run build
pnpm test
```

The compatibility check guards against reintroducing the removed
`settingsNamespace()` API and verifies that DSH peer ranges include
`0.1.5-rc.1`.

## Installation from this fork

After the compatibility branch is merged to `main`:

```sh
dsh plugin add github:MilletQ/dsh-cot-summerization
```

or:

```sh
cd ~/.dsh/profiles/web
pnpm add github:MilletQ/dsh-cot-summerization
```
