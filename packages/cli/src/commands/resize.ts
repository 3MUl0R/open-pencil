import { defineCommand } from 'citty'
import { runTool } from '../tool-runner'
import { ok } from '../format'

export default defineCommand({
  meta: { description: 'Resize a node' },
  args: {
    file: { type: 'positional', description: '.fig file path', required: true },
    id: { type: 'string', description: 'Node ID', required: true },
    width: { type: 'string', description: 'Width', required: true },
    height: { type: 'string', description: 'Height', required: true },
    write: { type: 'boolean', alias: 'w', description: 'Write changes back to file' },
    output: { type: 'string', alias: 'o', description: 'Write to a different file' },
    json: { type: 'boolean', description: 'Output as JSON' },
    quiet: { type: 'boolean', alias: 'q', description: 'Suppress output' },
  },
  async run({ args }) {
    await runTool({
      file: args.file,
      toolName: 'node_resize',
      args: { id: args.id, width: args.width, height: args.height },
      write: args.write,
      output: args.output,
      json: args.json,
      quiet: args.quiet,
      formatResult: (r) => {
        const res = r as { id: string; width: number; height: number }
        return ok(`Resized ${res.id} to ${res.width}×${res.height}`)
      },
    })
  },
})
