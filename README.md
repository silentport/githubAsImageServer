### githubAsImageServer

>  A Koa middleware that use github.io as image repository

#### usage

```javascript
const Koa = require('koa')
const app = new Koa()

const githubAsImageServer = require('../lib');

app.use(githubAsImageServer({
  targetDir: `D:/project/silentport.github.io`, // local path of git pepo
  repo: 'https://github.com/silentport/silentport.github.io.git', // address of git repo
  url: 'https://silentport.github.io', // host of github.io
  dir: 'upload', // dirname will save image
  project: 'blog', // child dirname will save image
  router: '/upload' // path of request
}))

app.use(async (ctx, next) => {
    next()
})

app.listen(8002, () => {
  console.log('server is started!');
})

```

