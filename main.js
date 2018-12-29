const http = require('http');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const webp = require('webp-converter');
const formidable = require('formidable');
const {
  getDate
} = require('./utils');


module.exports = (options) => {

   return async (ctx, next) => {
    let req = ctx.req || ctx;
    let res = ctx.res || next;

    if (req.method !== 'POST' && req.url !== options.router) {
      if (typeof next === 'function') next();
      return;
    }
  
    const { targetDir, repo, url, dir, project } = options;
    const fs = require('fs');
    const uploadDir = targetDir + '/' + dir || 'upload';
    const childDir = uploadDir + '/' + project;
    const form = new formidable.IncomingForm();
  
    const execCommand = async (command, options = {
      cwd: targetDir
    }) => {
      const {
        stdout,
        stderr
      } = await exec(command, options);
      console.log(stdout);
      console.log(stderr);
  
    };
  
    const isExistDir = dir => fs.existsSync(dir);
  
    const ensureDirExist = (dir) => {
      if (!isExistDir(dir)) {
        fs.mkdirSync(dir);
      }
    }
  
    const uniquePath = path => {
      return path.replace(
        /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        suffix => `_${getDate()}${suffix}`
      );
    }
  
    if (!isExistDir(targetDir)) {
      ensureDirExist(targetDir);
      const cwd = targetDir.split('/');
      cwd.pop();
      await execCommand(`git clone ${repo}`, {
        cwd: cwd.join('/')
      });
  
    }
  
    ensureDirExist(uploadDir);
    ensureDirExist(childDir)
  
    form.uploadDir = childDir;

    form.parse(req, function (err, fields, files) {
      
      if (err){
        console.log(err);
        if (typeof next === 'function') next();
        return ;
      } 
      let keys = Object.keys(files);
      if (keys.length === 0 && typeof next === 'function') next();

      keys.forEach(key => {
        const originPath = files[key].path;
        let targetPath = path.join(path.dirname(originPath), encodeURI(files[key].name));
        targetPath = uniquePath(targetPath);
        fs.rename(originPath, targetPath, async err => {
  
          if (err) throw err;
          const imgName = targetPath.split(/\/|\\/).pop();
          const webpName = imgName.split('.')[0] + '.webp';
          const resUrl = url + '/upload/' + project + '/' + webpName;
  
          webp.cwebp(
            targetPath,
            targetPath.replace(new RegExp(imgName), webpName),
            '-q 80',
            async status => {
              //if exicuted successfully status will be '100'
              //if exicuted unsuccessfully status will be '101'
  
              console.log(status);
              fs.unlink(targetPath, async () => {
                await execCommand('git pull');
                await execCommand('git add .');
                await execCommand(`git commit -m "add ${imgName}"`);
                await execCommand('git push');
                console.log(res.body, 09)
                res.body = {
                  url: resUrl,
                }
                res.end(
                  JSON.stringify({
                    url: resUrl,
                  })
                );
                next();
              });
            }
          );
  
        });
      });
    });
  
  };
}
