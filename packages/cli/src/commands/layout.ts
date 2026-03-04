import { defineCommand } from 'citty'

import { runTool } from '../tool-runner'
import { ok } from '../format'

export default defineCommand({
  meta: { description: 'Set auto-layout (flexbox) on a frame' },
  args: {
    file: { type: 'positional', description: '.fig file path', required: true },
    id: { type: 'string', required: true, description: 'Frame node ID' },
    direction: { type: 'string', required: true, description: 'Layout direction (HORIZONTAL, VERTICAL)' },
    spacing: { type: 'string', description: 'Gap between items' },
    padding: { type: 'string', description: 'Equal padding on all sides' },
    'padding-horizontal': { type: 'string', description: 'Horizontal padding' },
    'padding-vertical': { type: 'string', description: 'Vertical padding' },
    align: { type: 'string', description: 'Primary axis alignment (MIN, CENTER, MAX, SPACE_BETWEEN)' },
    'counter-align': { type: 'string', description: 'Cross axis alignment (MIN, CENTER, MAX, STRETCH)' },
    write: { type: 'boolean', alias: 'w', description: 'Write changes back to file' },
    output: { type: 'string', alias: 'o', description: 'Write to a different file' },
    json: { type: 'boolean', description: 'Output as JSON' },
    quiet: { type: 'boolean', alias: 'q', description: 'Suppress output' },
  },
  async run({ args }) {
    await runTool({
      file: args.file,
      toolName: 'set_layout',
      args: {
        id: args.id,
        direction: args.direction,
        spacing: args.spacing,
        padding: args.padding,
        padding_horizontal: args['padding-horizontal'],
        padding_vertical: args['padding-vertical'],
        align: args.align,
        counter_align: args['counter-align'],
      },
      write: args.write,
      output: args.output,
      json: args.json,
      quiet: args.quiet,
      formatResult: (r) => ok(`Set layout on ${(r as { id: string }).id} (${args.direction})`),
    })
  },
})
