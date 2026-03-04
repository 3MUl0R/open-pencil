import { defineCommand } from 'citty'
import { resolve } from 'node:path'

import { SceneGraph, exportFigFile } from '@open-pencil/core'
import { ok, printError } from '../format'

export default defineCommand({
  meta: { description: 'Create a new blank .fig file' },
  args: {
    output: { type: 'positional', description: 'Output .fig file path', required: true },
    name: { type: 'string', description: 'Page name (default: "Page 1")' },
    json: { type: 'boolean', description: 'Output as JSON' },
    quiet: { type: 'boolean', alias: 'q', description: 'Suppress output' }
  },
  async run({ args }) {
    try {
      const graph = new SceneGraph()
      const pages = graph.getPages()
      const page = pages[0]

      if (!page) {
        printError('Failed to create document: no default page')
        process.exit(1)
      }

      if (args.name) {
        page.name = args.name
      }

      const outPath = resolve(args.output)
      const data = await exportFigFile(graph)
      await Bun.write(outPath, data)

      if (!args.quiet) {
        if (args.json) {
          console.log(JSON.stringify({
            path: outPath,
            pages: [{ id: page.id, name: page.name }]
          }, null, 2))
        } else {
          console.log(ok(`Created ${outPath}`))
        }
      }
    } catch (err) {
      printError(err)
      process.exit(1)
    }
  }
})
