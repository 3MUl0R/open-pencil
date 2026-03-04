import { defineCommand } from 'citty'
import { runTool } from '../tool-runner'
import { ok, entity, formatType } from '../format'

export default defineCommand({
  meta: { description: 'Clone (duplicate) a node' },
  args: {
    file: { type: 'positional', description: '.fig file path', required: true },
    id: { type: 'string', description: 'Node ID to clone', required: true },
    write: { type: 'boolean', alias: 'w', description: 'Write changes back to file' },
    output: { type: 'string', alias: 'o', description: 'Write to a different file' },
    json: { type: 'boolean', description: 'Output as JSON' },
    quiet: { type: 'boolean', alias: 'q', description: 'Suppress output' },
  },
  async run({ args }) {
    await runTool({
      file: args.file,
      toolName: 'clone_node',
      args: { id: args.id },
      write: args.write,
      output: args.output,
      json: args.json,
      quiet: args.quiet,
      formatResult: (r) => {
        const res = r as { id: string; name: string; type: string }
        return ok(entity(formatType(res.type), res.name, res.id))
      },
    })
  },
})
