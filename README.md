### githubAsImageServer
[![Build Status](https://travis-ci.org/silentport/githubAsImageServer.svg?branch=master)](https://travis-ci.org/silentport/githubAsImageServer)
<a href="https://www.npmjs.com/package/github-as-image-server"><img alt="undefined" src="https://img.shields.io/npm/v/github-as-image-server.svg?style=flat"></a>
![](https://img.shields.io/node/v/github-as-image-server.svg?style=flat)
![](https://img.shields.io/npm/l/github-as-image-server.svg?style=flat)

> A Koa middleware that use github.io as image repository

#### usage

``` javascript
 npm i github-as-image-server -S
```

```javascript
const Koa = require('koa')
const app = new Koa()

const githubAsImageServer = require('../lib');

app.use(githubAsImageServer({
  targetDir: `D:/project/silentport.github.io`, // local path of git repo
  repo: 'https://github.com/silentport/silentport.github.io.git', // address of git repo
  url: 'https://silentport.github.io', // host of your github.io
  dir: 'upload', // dirname will save image
  project: 'blog', // child dirname will save image
  router: '/upload' // path of request
}))


app.listen(8002, () => {
  console.log('server is started!');
})

```

