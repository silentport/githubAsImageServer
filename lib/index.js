const fs = require('fs');
const path = require('path');
const util = require('util');
const formidable = require('formidable');
const formHandler = require('./form');
const exec = util.promisify(require('child_process').exec);
const { getDate, convertToWebp } = require('./utils');

module.exports = options => async (ctx, next) => {

    if (ctx.method !== 'POST' || ctx.path !== options.router) {
      next();
      return;
    }

    let result = null;
    const { targetDir, repo, url, dir, project } = options;
    const uploadDir = targetDir + '/' + dir || 'upload';
    const childDir = uploadDir + '/' + project;
    const form = new formidable.IncomingForm();
   
    const execCommand = async (command, options = { cwd: targetDir }) => {
      const ls = await exec(command, options);
      console.log(ls.stdout);
      console.log(ls.stderr);
    };

    const isExistDir = dir => fs.existsSync(dir);

    const ensureDirExist = dir => {
      if (!isExistDir(dir)) fs.mkdirSync(dir);
    }

    const pushToGithub = async imgList => {
      await execCommand('git pull');
      await execCommand('git add .');
      await execCommand(`git commit -m "add ${imgList}"`);
      await execCommand('git push');
    }

    const callback = async (files, keys) => {
      let result = { url: [] };
      let imgList = [];
      await (async () => {
        for await (const key of keys) {
          const originPath = files[key].path;
          const targetPath = uniquePath(path.join(path.dirname(originPath), encodeURI(files[key].name)));
          const imgName = targetPath.split(/\/|\\/).pop();
          const webpName = imgName.split('.')[0] + '.webp';
          const resUrl = url + '/upload/' + project + '/' + webpName;
          const newPath = targetPath.replace(new RegExp(imgName), webpName);
          fs.renameSync(originPath, targetPath);
          try {
            await convertToWebp(targetPath, newPath);
          } catch (err) {
            next();
            return;
          }   
          imgList.push(webpName);
          result.url.push(resUrl);

        }
      })();
      await pushToGithub(imgList.toString());
      return result;
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
    
    try {
      result = await formHandler(form, ctx.req, callback, next);
    } catch (err) {   
      result = {
        url: []
      }
    }
  
    ctx.body = result
  };
