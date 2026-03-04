#!/usr/bin/env bun
import { defineCommand, runMain } from 'citty'

import analyze from './commands/analyze'
import clone from './commands/clone'
import create from './commands/create'
import deleteCmd from './commands/delete'
import evalCmd from './commands/eval'
import exportCmd from './commands/export'
import fill from './commands/fill'
import find from './commands/find'
import info from './commands/info'
import layout from './commands/layout'
import move from './commands/move'
import newCmd from './commands/new'
import node from './commands/node'
import pages from './commands/pages'
import renderCmd from './commands/render'
import resize from './commands/resize'
import screenshot from './commands/screenshot'
import stroke from './commands/stroke'
import tree from './commands/tree'
import update from './commands/update'
import variables from './commands/variables'

const { version } = await import('../package.json')

const main = defineCommand({
  meta: {
    name: 'open-pencil',
    description: 'OpenPencil CLI — create, modify, inspect, and export .fig design files',
    version
  },
  subCommands: {
    analyze,
    clone,
    create,
    delete: deleteCmd,
    eval: evalCmd,
    export: exportCmd,
    fill,
    find,
    info,
    layout,
    move,
    new: newCmd,
    node,
    pages,
    render: renderCmd,
    resize,
    screenshot,
    stroke,
    tree,
    update,
    variables
  }
})

runMain(main)
