const webp = require('webp-converter');
const fs = require('fs');
module.exports = {
  getDate: () => {
    let date = new Date;
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    let d = date.getDate()
    let hh = date.getHours()
    let mm = date.getMinutes()
    let ss = date.getSeconds()
    let ms = date.getMilliseconds()

    const f = num => {
      return num > 9 ? num : `0${num}`
    }
    
    return `${y}-${f(m)}-${f(d)}_${f(hh)}-${f(mm)}-${f(ss)}-${f(ms)}`;
  },
  convertToWebp: (targetPath, newPath) => {
    return new Promise((resolve, reject) => {
      webp.cwebp(
        targetPath,
        newPath,
        '-q 80',
        async status => {
          if (status.split(/\n/)[0] === '100') {
            fs.unlinkSync(targetPath);
            resolve();
          } else {
            reject(new Error('convert webp fails'))
          }
          
        });
    })

  }
}