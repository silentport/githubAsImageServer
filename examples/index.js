const Koa = require('koa')
const app = new Koa()

const githubAsImageServer = require('../lib');

app.use(githubAsImageServer({
  targetDir: `D:/project/silentport.github.io`,
  repo: 'https://github.com/silentport/silentport.github.io.git',
  url: 'https://silentport.github.io',
  dir: 'upload',
  project: 'blog',
  router: '/upload'
}))

app.use(async (ctx, next) => {
    next()
})

app.listen(8002, () => {
  console.log('server is started!');
})