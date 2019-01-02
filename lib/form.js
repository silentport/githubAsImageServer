module.exports = (form, req, success, next) => {
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      const keys = Object.keys(files);
      if (err || keys.length === 0) {
        reject(new Error('parse fails or no file to upload'));
        next();
        return;
      }
      resolve(success(files, keys));
    })
  })
}