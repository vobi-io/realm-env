#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const config = require('../lib/config')
const { generateFunctions, generateTriggers } = require('../lib/generators')

const functions = generateFunctions(config.functions, config.triggersPath)
const triggers = generateTriggers(config.triggers, config.triggersPath)

const files = [...functions, ...triggers]

const dest = path.join(__dirname, '../../../', config.destFolder)

const isFunctionsDefined = fs.existsSync(path.join(dest, 'functions'))
const isTriggersDefined = fs.existsSync(path.join(dest, 'triggers'))

if (!isFunctionsDefined) { fs.mkdirSync(path.join(dest, 'functions')) }
if (!isTriggersDefined) { fs.mkdirSync(path.join(dest, 'triggers')) }

for (const file of files) {
  switch (file.type) {
    case 'function':
      const folderPath = path.join(dest, 'functions', file.name)
      if (!fs.existsSync(folderPath)) { fs.mkdirSync(folderPath) }
      fs.writeFileSync(path.join(folderPath, 'source.js'), file.file)
      fs.writeFileSync(path.join(folderPath, 'config.json'), file.config)
      break;
    case 'trigger':
      fs.writeFileSync(path.join(dest, 'triggers', file.fileName), file.file)
      break;
    default:
      return
  }
}

fs.writeFileSync(path.join(dest, 'config.json'), JSON.stringify(config.realmConfig))
