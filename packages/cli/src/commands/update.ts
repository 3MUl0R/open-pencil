import { defineCommand } from 'citty'

import { runTool } from '../tool-runner'
import { ok } from '../format'

export default defineCommand({
  meta: { description: 'Update properties of an existing node' },
  args: {
    file: { type: 'positional', description: '.fig file path', required: true },
    id: { type: 'string', required: true, description: 'Node ID' },
    x: { type: 'string', description: 'X position' },
    y: { type: 'string', description: 'Y position' },
    width: { type: 'string', description: 'Width' },
    height: { type: 'string', description: 'Height' },
    opacity: { type: 'string', description: 'Opacity (0-1)' },
    'corner-radius': { type: 'string', description: 'Corner radius' },
    visible: { type: 'string', description: 'Visibility (true/false)' },
    text: { type: 'string', description: 'Text content (TEXT nodes)' },
    'font-size': { type: 'string', description: 'Font size' },
    'font-weight': { type: 'string', description: 'Font weight (100-900)' },
    name: { type: 'string', description: 'Layer name' },
    write: { type: 'boolean', alias: 'w', description: 'Write changes back to file' },
    output: { type: 'string', alias: 'o', description: 'Write to a different file' },
    json: { type: 'boolean', description: 'Output as JSON' },
    quiet: { type: 'boolean', alias: 'q', description: 'Suppress output' },
  },
  async run({ args }) {
    await runTool({
      file: args.file,
      toolName: 'update_node',
      args: {
        id: args.id,
        x: args.x,
        y: args.y,
        width: args.width,
        height: args.height,
        opacity: args.opacity,
        corner_radius: args['corner-radius'],
        visible: args.visible,
        text: args.text,
        font_size: args['font-size'],
        font_weight: args['font-weight'],
        name: args.name,
      },
      write: args.write,
      output: args.output,
      json: args.json,
      quiet: args.quiet,
      formatResult: (r) => {
        const res = r as { id: string; updated: string[] }
        return ok(`Updated ${res.id}: ${res.updated.join(', ')}`)
      },
    })
  },
})
