import { defineCommand } from 'citty'
import { basename, extname, resolve } from 'node:path'

import type { SceneGraph, ExportFormat } from '@open-pencil/core'
import { loadDocument, loadFonts, exportNodes } from '../headless'
import { ok, printError } from '../format'

function findNodeByName(graph: SceneGraph, pageId: string, name: string): string | undefined {
  function search(nodeId: string): string | undefined {
    const node = graph.getNode(nodeId)
    if (!node) return undefined
    if (node.name === name) return node.id
    for (const childId of node.childIds) {
      const found = search(childId)
      if (found) return found
    }
    return undefined
  }

  const page = graph.getNode(pageId)
  if (!page) return undefined
  for (const childId of page.childIds) {
    const found = search(childId)
    if (found) return found
  }
  return undefined
}

export default defineCommand({
  meta: { description: 'Render a .fig file to an image (optimized for LLM feedback loops)' },
  args: {
    file: { type: 'positional', description: '.fig file path', required: true },
    node: { type: 'string', description: 'Node ID to render' },
    name: { type: 'string', description: 'Find node by name instead of ID' },
    page: { type: 'string', description: 'Page name (default: first page)' },
    output: { type: 'string', alias: 'o', description: 'Output file path (auto-generated if omitted)' },
    scale: { type: 'string', alias: 's', description: 'Scale factor (default: 1)', default: '1' },
    format: { type: 'string', alias: 'f', description: 'Export format: png, jpg, webp (default: png)', default: 'png' },
    json: { type: 'boolean', description: 'Output as JSON' },
    quiet: { type: 'boolean', alias: 'q', description: 'Suppress output' }
  },
  async run({ args }) {
    try {
      const format = args.format.toUpperCase() as ExportFormat
      if (!['PNG', 'JPG', 'WEBP'].includes(format)) {
        printError(`Invalid format "${args.format}". Use png, jpg, or webp.`)
        process.exit(1)
      }

      const graph = await loadDocument(args.file)
      await loadFonts(graph)

      const pages = graph.getPages()
      const page = args.page
        ? pages.find((p) => p.name === args.page)
        : pages[0]

      if (!page) {
        printError(args.page ? `Page "${args.page}" not found.` : 'No pages found in document.')
        process.exit(1)
      }

      let targetNodeId: string | undefined

      if (args.name) {
        targetNodeId = findNodeByName(graph, page.id, args.name)
        if (!targetNodeId) {
          printError(`Node named "${args.name}" not found.`)
          process.exit(1)
        }
      } else if (args.node) {
        targetNodeId = args.node
      }

      const nodeIds = targetNodeId ? [targetNodeId] : page.childIds

      const ext = format.toLowerCase() === 'jpg' ? 'jpg' : format.toLowerCase()
      const outPath = args.output
        ? resolve(args.output)
        : resolve(`${basename(args.file, extname(args.file))}-${Date.now()}.${ext}`)

      const data = await exportNodes(graph, page.id, nodeIds, {
        scale: Number(args.scale),
        format
      })

      if (!data) {
        printError('Nothing to render (empty page or no visible nodes).')
        process.exit(1)
      }

      await Bun.write(outPath, data)

      if (!args.quiet) {
        if (args.json) {
          console.log(JSON.stringify({
            path: outPath,
            format: ext,
            bytes: data.byteLength
          }, null, 2))
        } else {
          console.log(ok(`Screenshot saved: ${outPath} (${(data.byteLength / 1024).toFixed(1)} KB)`))
        }
      }
    } catch (err) {
      printError(err)
      process.exit(1)
    }
  }
})
