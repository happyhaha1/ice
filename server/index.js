import Koa from 'koa'
import { Nuxt, Builder } from 'nuxt'
import { resolve } from 'path'
import R from 'ramda'

const app = new Koa()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env === 'production')
const r = path => resolve(__dirname, path)
const MIDDLEWARE = ['router']

// Instantiate nuxt.js
const nuxt = new Nuxt(config)

const useMiddleware = (app) => {
  return R.map(R.compose(
    R.map(i => i(app)),
    require,
    i => `${r('./middleware')}/${i}`)
  )
}

// Build in development
if (config.dev) {
  const builder = new Builder(nuxt)
  builder.build().catch(e => {
    console.error(e) // eslint-disable-line no-console
    process.exit(1)
  })
}
useMiddleware(app)(MIDDLEWARE)
app.use(ctx => {
  ctx.status = 200 // koa defaults to 404 when it sees that status is unset

  return new Promise((resolve, reject) => {
    ctx.res.on('close', resolve)
    ctx.res.on('finish', resolve)
    nuxt.render(ctx.req, ctx.res, promise => {
      // nuxt.render passes a rejected promise into callback on error.
      promise.then(resolve).catch(reject)
    })
  })
})

app.listen(port, host)
console.log('Server listening on ' + host + ':' + port) // eslint-disable-line no-console
