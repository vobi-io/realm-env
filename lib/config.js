const path = require('path')

/**
 * @desc loads config folder from passed arguments
 */
const configPath = path.join(__dirname, '../../../', process.argv[2])

let config = {}

try {
  config = require(configPath)
} catch(err) {
  throw new Error("Invlaid config path")
}

module.exports = config