import { defineCommand } from 'citty'
import { runTool } from '../tool-runner'
import { ok } from '../format'

export default defineCommand({
  meta: { description: 'Move a node to new coordinates' },
  args: {
    file: { type: 'positional', description: '.fig file path', required: true },
    id: { type: 'string', description: 'Node ID', required: true },
    x: { type: 'string', description: 'X position', required: true },
    y: { type: 'string', description: 'Y position', required: true },
    write: { type: 'boolean', alias: 'w', description: 'Write changes back to file' },
    output: { type: 'string', alias: 'o', description: 'Write to a different file' },
    json: { type: 'boolean', description: 'Output as JSON' },
    quiet: { type: 'boolean', alias: 'q', description: 'Suppress output' },
  },
  async run({ args }) {
    await runTool({
      file: args.file,
      toolName: 'node_move',
      args: { id: args.id, x: args.x, y: args.y },
      write: args.write,
      output: args.output,
      json: args.json,
      quiet: args.quiet,
      formatResult: (r) => {
        const res = r as { id: string; x: number; y: number }
        return ok(`Moved ${res.id} to (${res.x}, ${res.y})`)
      },
    })
  },
})
