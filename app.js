const Koa = require('koa')
const app = new Koa()

const githubAsRepo = require('./main');

app.use(githubAsRepo({
  targetDir: `D:/project/silentport.github.io`,
  repo: 'https://github.com/silentport/silentport.github.io.git',
  url: 'https://silentport.github.io',
  dir: 'upload',
  project: 'blog',
  router: '/upload'
}))
app.use(async (ctx, next) => {
    console.log(88)
    next()
})

app.listen(8002, () => {
  console.log('server is started!');
})