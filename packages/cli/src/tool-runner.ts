import { FigmaAPI, ALL_TOOLS, exportFigFile } from '@open-pencil/core'
import type { ToolDef, ParamDef } from '@open-pencil/core'
import { loadDocument } from './headless'
import { ok, printError } from './format'

function serializeResult(value: unknown): unknown {
  if (value === undefined || value === null) return value
  if (typeof value === 'object' && value !== null && 'toJSON' in value && typeof value.toJSON === 'function') {
    return value.toJSON()
  }
  if (Array.isArray(value)) return value.map(serializeResult)
  return value
}

function coerceArgs(params: Record<string, ParamDef>, args: Record<string, unknown>): Record<string, unknown> {
  const coerced: Record<string, unknown> = { ...args }
  for (const [key, param] of Object.entries(params)) {
    const value = coerced[key]
    if (value === undefined || value === null) continue

    if (param.type === 'number' && typeof value === 'string') {
      coerced[key] = Number(value)
    } else if (param.type === 'boolean' && typeof value === 'string') {
      coerced[key] = value === 'true'
    }
  }
  return coerced
}

interface RunToolOptions {
  file: string
  toolName: string
  args: Record<string, unknown>
  write?: boolean
  output?: string
  json?: boolean
  quiet?: boolean
  formatResult?: (result: unknown) => string
}

export async function runTool(opts: RunToolOptions): Promise<unknown> {
  const { file, toolName, args, write, output, json, quiet, formatResult } = opts

  const tool: ToolDef | undefined = ALL_TOOLS.find((t) => t.name === toolName)
  if (!tool) {
    printError(`Unknown tool: ${toolName}`)
    process.exit(1)
  }

  let graph
  try {
    graph = await loadDocument(file)
  } catch (err) {
    printError(err instanceof Error ? err.message : String(err))
    process.exit(1)
  }

  const figma = new FigmaAPI(graph)

  const coerced = coerceArgs(tool.params, args)
  let result: unknown
  try {
    result = await tool.execute(figma, coerced)
  } catch (err) {
    printError(err instanceof Error ? err.message : String(err))
    process.exit(1)
  }

  const serialized = serializeResult(result)

  if (!quiet && serialized !== undefined) {
    if (json) {
      console.log(JSON.stringify(serialized, null, 2))
    } else if (formatResult) {
      console.log(formatResult(serialized))
    } else {
      console.log(JSON.stringify(serialized, null, 2))
    }
  }

  if (write || output) {
    const outPath = output ?? file
    const data = await exportFigFile(graph)
    await Bun.write(outPath, data)
    if (!quiet) {
      console.error(ok(`Written to ${outPath}`))
    }
  }

  return serialized
}
