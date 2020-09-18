
const path = require('path')
const fs = require('fs')

const { capitalize, replaceEnv } = require('./helper')

/**
 * @desc generates realm function config.json file
 * @param {string} name name of function
 */
const generateFunctionConfig = (name) => {
  return JSON.stringify({ name, privete: false })
}

/**
 * @desc loops through specified function names reads functions from disk replaces env variables and creates
 * function object 
 * @param {Object} functions functions object specified from config file
 * @param {string} functionsPath functions path specified in config file
 */
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
        config: generateFunctionConfig(env + capitalize(functionName)),
        env
      })
    )

    return genereatedFunctions
  }
}

/**
 * @desc loops through specified trigger names reads triggers from disk replaces env variables and creates
 * trigger object
 * @param {Object} triggers triggers object specified from config file
 * @param {string} triggersPath triggers path specified in config file
 */
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
        fileName: env + capitalize(fileName),
        env
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
