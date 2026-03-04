import { defineCommand } from 'citty'

import { runTool } from '../tool-runner'
import { ok } from '../format'

export default defineCommand({
  meta: { description: 'Set stroke (border) on a node' },
  args: {
    file: { type: 'positional', description: '.fig file path', required: true },
    id: { type: 'string', required: true, description: 'Node ID' },
    color: { type: 'string', required: true, description: 'Stroke color (hex)' },
    weight: { type: 'string', description: 'Stroke weight', default: '1' },
    align: { type: 'string', description: 'Stroke alignment (INSIDE, CENTER, OUTSIDE)', default: 'INSIDE' },
    write: { type: 'boolean', alias: 'w', description: 'Write changes back to file' },
    output: { type: 'string', alias: 'o', description: 'Write to a different file' },
    json: { type: 'boolean', description: 'Output as JSON' },
    quiet: { type: 'boolean', alias: 'q', description: 'Suppress output' },
  },
  async run({ args }) {
    await runTool({
      file: args.file,
      toolName: 'set_stroke',
      args: { id: args.id, color: args.color, weight: args.weight, align: args.align },
      write: args.write,
      output: args.output,
      json: args.json,
      quiet: args.quiet,
      formatResult: (r) => ok(`Set stroke on ${(r as { id: string }).id}`),
    })
  },
})
