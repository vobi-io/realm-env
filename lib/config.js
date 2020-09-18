const path = require('path')

const configPath = path.join(require.main, '../', process.argv[2])

let config = {}

try {
  config = require(configPath)
} catch(err) {
  throw new Error("Invlaid config path")
}

module.exports = config