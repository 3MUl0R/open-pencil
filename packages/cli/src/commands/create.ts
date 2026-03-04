import { defineCommand } from 'citty'

import { runTool } from '../tool-runner'
import { ok, entity, formatType } from '../format'

export default defineCommand({
  meta: { description: 'Create a shape on the canvas' },
  args: {
    file: { type: 'positional', description: '.fig file path', required: true },
    type: { type: 'string', required: true, description: 'Node type (FRAME, RECTANGLE, ELLIPSE, TEXT, LINE, STAR, POLYGON, SECTION)' },
    x: { type: 'string', required: true, description: 'X position' },
    y: { type: 'string', required: true, description: 'Y position' },
    width: { type: 'string', required: true, description: 'Width in pixels' },
    height: { type: 'string', required: true, description: 'Height in pixels' },
    name: { type: 'string', description: 'Node name shown in layers panel' },
    parent: { type: 'string', description: 'Parent node ID to nest inside' },
    write: { type: 'boolean', alias: 'w', description: 'Write changes back to file' },
    output: { type: 'string', alias: 'o', description: 'Write to a different file' },
    json: { type: 'boolean', description: 'Output as JSON' },
    quiet: { type: 'boolean', alias: 'q', description: 'Suppress output' },
  },
  async run({ args }) {
    await runTool({
      file: args.file,
      toolName: 'create_shape',
      args: { type: args.type, x: args.x, y: args.y, width: args.width, height: args.height, name: args.name, parent_id: args.parent },
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
