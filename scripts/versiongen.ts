import fs from 'node:fs/promises'
import { dependenciesMap } from '../src/cli/constants'

const names = new Set([
  'eslint',
  ...Object.values(dependenciesMap).flat(),
])

const packageJson = JSON.parse(await fs.readFile(new URL('../package.json', import.meta.url), 'utf-8'))

const allDeps = {
  ...packageJson.dependencies,
  ...packageJson.peerDependencies,
  ...packageJson.devDependencies,
}

const versions = Object.fromEntries(Array.from(names).map((name) => {
  const version = allDeps[name]
  if (!version) { throw new Error(`Package ${name} not found`) }
  return [name, version]
}).sort((a, b) => a[0].localeCompare(b[0])))

await fs.writeFile(new URL('../src/cli/constants-generated.ts', import.meta.url), `export const versionsMap = ${JSON.stringify(versions, null, 2)}`)
