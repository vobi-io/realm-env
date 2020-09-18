const config = require('./config').env

/**
 * @desc replaces environment variables by variables specified in config environment object
 * @param {string} file read file string from disk
 * @param {string} env environment name
 */
const replaceEnv = (file, env = 'production') => {
  let str = ''

  for (const envKey in config[env]) {
    str = file.split(`[${envKey}]`).join(config[env][envKey])
  }

  return str
}

/**
 * @desc capitalizes first letter of string
 * @param {string} s any string
 */
const capitalize = (s) => {
  return s[0].toUpperCase() + s.slice(1)
}

module.exports = {
  capitalize,
  replaceEnv,
}