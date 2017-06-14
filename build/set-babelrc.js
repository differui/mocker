const fs = require('fs')
const babelrc = fs.readFileSync('./src/.babelrc')
const config = JSON.parse(babelrc.toString())

config.presets[0][1].modules = process.env.NODE_MODULES === '0' ? false : process.env.NODE_MODULES
fs.writeFileSync('./src/.babelrc', JSON.stringify(config, null, 2))
