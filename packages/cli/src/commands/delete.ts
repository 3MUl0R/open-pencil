import { defineCommand } from 'citty'
import { runTool } from '../tool-runner'
import { ok } from '../format'

export default defineCommand({
  meta: { description: 'Delete a node by ID' },
  args: {
    file: { type: 'positional', description: '.fig file path', required: true },
    id: { type: 'string', description: 'Node ID to delete', required: true },
    write: { type: 'boolean', alias: 'w', description: 'Write changes back to file' },
    output: { type: 'string', alias: 'o', description: 'Write to a different file' },
    json: { type: 'boolean', description: 'Output as JSON' },
    quiet: { type: 'boolean', alias: 'q', description: 'Suppress output' },
  },
  async run({ args }) {
    await runTool({
      file: args.file,
      toolName: 'delete_node',
      args: { id: args.id },
      write: args.write,
      output: args.output,
      json: args.json,
      quiet: args.quiet,
      formatResult: (r) => ok(`Deleted ${(r as { deleted: string }).deleted}`),
    })
  },
})
