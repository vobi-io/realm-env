const config = require(process.argv[2]).env

const replaceEnv = (file, env = 'production') => {
  let str = ''

  for (const envKey in config[env]) {
    str = file.split(`[${envKey}]`).join(config[env][envKey])
  }

  return str
}

const generateFunctionConfig = (name) => {
  return JSON.stringify({ name, privete: false })
}

const generateTrigger = (fileContent, name, fileName, path) => {
  const generatedTriggers = []
  const parsedFile = JSON.parse(fileContent)

  for (const key in config) {
    generatedTriggers.push({
      name: key + capitalize(name),
      file: JSON.stringify({
        ...parsedFile,
        function_name: key + capitalize(parsedFile.function_name),
        name: key + capitalize(parsedFile.name)
      }),
      env: key,
      fileName,
      path,
    })
  }

  return generatedTriggers
}

const capitalize = (s) => {
  return s[0].toUpperCase() + s.slice(1)
}

module.exports = {
  capitalize,
  replaceEnv,
  generateFunctionConfig,
  generateTrigger,
}