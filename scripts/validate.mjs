#!/usr/bin/env node
/**
 * Validate a plugin market index with the official format-1 validator.
 *
 * Usage: node scripts/validate.mjs [index.json] [indexUrl]
 * `indexUrl` is the URL the index will be served from; relative icon paths
 * resolve against it, so pass the real deployment URL to catch icon mistakes.
 */
import { readFile } from 'node:fs/promises'
import { MarketIndexError, marketInstallTarget, parseMarketIndex } from '@deepseek-ai/dsh-plugin-market-index'

const file = process.argv[2] ?? 'index.json'
const indexUrl = process.argv[3] ?? 'https://example.github.io/dsh-plugin-market/index.json'

const raw = await readFile(file, 'utf8')

let document
try {
  document = JSON.parse(raw)
} catch (error) {
  console.error(`FAIL ${file} is not valid JSON: ${error instanceof Error ? error.message : String(error)}`)
  process.exit(1)
}

let index
try {
  index = parseMarketIndex(document, indexUrl)
} catch (error) {
  if (error instanceof MarketIndexError) {
    console.error(`FAIL ${error.path} ${error.reason}`)
    process.exit(1)
  }
  throw error
}

const title = typeof index.title === 'string' ? index.title : index.title.zh ?? index.title.en
console.log(`OK   ${title} — ${String(index.plugins.length)} plugins, ${String(Object.keys(index.metadata.categories).length)} categories, ${String(Object.keys(index.metadata.labels).length)} labels, index URL ${indexUrl}`)

for (const plugin of index.plugins) {
  const version = plugin.versions[0]
  if (version === undefined) continue
  const target = marketInstallTarget(plugin.name, version)
  const engines = version.engines.dsh ?? 'unset'
  const kind = version.source.type === 'git' ? 'git' : 'npm'
  console.log(`  - ${plugin.name}@${version.version}  (${kind})  engines.dsh=${engines}`)
  console.log(`    install: ${target.spec}`)
  if (target.registry !== undefined) console.log(`    registry: ${target.registry}`)
  const labels = plugin.metadata.labels.join(',')
  const category = plugin.metadata.category ?? '(none)'
  console.log(`    category=${category}  labels=${labels || '(none)'}  icon=${plugin.icon ?? '(default artwork)'}`)
}
