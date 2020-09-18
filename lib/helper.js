const config = require('./config').env

const replaceEnv = (file, env = 'production') => {
  let str = ''

  for (const envKey in config[env]) {
    str = file.split(`[${envKey}]`).join(config[env][envKey])
  }

  return str
}

const capitalize = (s) => {
  return s[0].toUpperCase() + s.slice(1)
}

module.exports = {
  capitalize,
  replaceEnv,
}