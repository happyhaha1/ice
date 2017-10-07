const { resolve } = require('path')
const r = path => resolve(__dirname, path)

require('babel-core/register')({
  'presets': [
    'stage-0',
    'es2015'
  ]
})

require('babel-polyfill')
require('./server')
