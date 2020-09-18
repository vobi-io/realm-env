
const path = require('path')
const fs = require('fs')

const { capitalize, replaceEnv } = require('./helper')

const generateFunctionConfig = (name) => {
  return JSON.stringify({ name, privete: false })
}

const generateFunctions = (functions, functionsPath) => {
  for (const functionName in functions) {

    const fileName = `${functionName}.js`
    const functionPath = path.join(__dirname, '../../../', functionsPath, fileName)
    const file = fs.readFileSync(functionPath, 'utf8')

    const genereatedFunctions = functions[functionName].env.map((env) => ({
      file: replaceEnv(file, env),
      name: env + capitalize(functionName),
      fileName: env + capitalize(fileName),
      path: functionPath,
      type: 'function',
      env,
      config: generateFunctionConfig(env + capitalize(functionName))
    })
    )

    return genereatedFunctions
  }
}

const generateTriggers = (triggers, triggersPath) => {
  for (const triggerName in triggers) {
    const fileName = `${triggerName}.json`
    const triggerPath = path.join(__dirname, '../../../', triggersPath, fileName)

    const file = fs.readFileSync(triggerPath, 'utf8')
    const parsedFile = JSON.parse(file)

    const generatedTriggers = triggers[triggerName].env.map((env) => ({
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

    return generatedTriggers
  }
}

module.exports = {
  generateFunctionConfig,
  generateFunctions,
  generateTriggers
}