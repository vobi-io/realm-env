#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const config = require('../lib/config')
const { capitalize, replaceEnv, generateFunctionConfig } = require('../lib/helper')

let files = []

for (const functionName in config.functions) {
  const fileName = `${functionName}.js`
  const functionPath = path.join(__dirname, '../../../', config.functionsPath, fileName)
  const file = fs.readFileSync(functionPath, 'utf8')

  const functions = config.functions[functionName].env.map((env) => ({
    file: replaceEnv(file, env),
    name: env + capitalize(functionName),
    fileName: env + capitalize(fileName),
    path: functionPath,
    type: 'function',
    env,
    config: generateFunctionConfig(env + capitalize(functionName))
  })
  )

  files = [...files, ...functions]
}


for (const triggerName in config.triggers) {
  const fileName = `${triggerName}.json`
  const triggerPath = path.join(__dirname, '../../../', config.triggersPath, fileName)

  const file = fs.readFileSync(triggerPath, 'utf8')
  const parsedFile = JSON.parse(file)

  const triggers = config.triggers[triggerName].env.map((env) => ({
    name: env + capitalize(triggerName),
    file: JSON.stringify({
      ...parsedFile,
      function_name: env + capitalize(parsedFile.function_name),
      name: env + capitalize(parsedFile.name)
    }),
    type: 'trigger',
    path: triggerPath,
    env,
    fileName: env + capitalize(fileName),
  })
  )

  files = [...files, ...triggers]
}

const dest = path.join(__dirname, '../../../', config.destFolder)
fs.mkdirSync(path.join(dest, 'functions'))
fs.mkdirSync(path.join(dest, 'triggers'))

for (const file of files) {
  switch (file.type) {
    case 'function':
      const folderPath = path.join(dest, 'functions', file.name)
      fs.mkdirSync(folderPath)
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
