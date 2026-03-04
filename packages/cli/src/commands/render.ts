import { defineCommand } from 'citty'

import { runTool } from '../tool-runner'
import { ok, entity, formatType, printError } from '../format'

export default defineCommand({
  meta: { description: 'Render JSX to design nodes' },
  args: {
    file: { type: 'positional', description: '.fig file path', required: true },
    jsx: { type: 'string', description: 'JSX string to render' },
    x: { type: 'string', description: 'X position of root node' },
    y: { type: 'string', description: 'Y position of root node' },
    parent: { type: 'string', description: 'Parent node ID to render into' },
    stdin: { type: 'boolean', description: 'Read JSX from stdin' },
    write: { type: 'boolean', alias: 'w', description: 'Write changes back to file' },
    output: { type: 'string', alias: 'o', description: 'Write to a different file' },
    json: { type: 'boolean', description: 'Output as JSON' },
    quiet: { type: 'boolean', alias: 'q', description: 'Suppress output' },
  },
  async run({ args }) {
    let jsx = args.jsx

    if (args.stdin) {
      const chunks: Buffer[] = []
      for await (const chunk of process.stdin) chunks.push(chunk as Buffer)
      jsx = Buffer.concat(chunks).toString('utf-8')
    }

    if (!jsx) {
      printError('Provide JSX via --jsx or --stdin')
      process.exit(1)
    }

    await runTool({
      file: args.file,
      toolName: 'render',
      args: { jsx, x: args.x, y: args.y, parent_id: args.parent },
      write: args.write,
      output: args.output,
      json: args.json,
      quiet: args.quiet,
      formatResult: (r) => {
        const res = r as { id: string; name: string; type: string; children?: string[] }
        return ok(entity(formatType(res.type), res.name, res.id))
      },
    })
  },
})
