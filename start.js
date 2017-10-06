const { resolve } = require('path')
const r = path => resolve(__dirname, path)

require('babel-core/register')({
  'presets': [
    'stage-3',
    'latest-node'
  ]
})

require('babel-polyfill')
require('./server')
