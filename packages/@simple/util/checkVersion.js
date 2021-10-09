const path = require('path')
const fs = require('fs-extra')
const { execSync } = require('child_process')

const filePath = _path => path.join(__dirname, _path)
const checkVersionPath = filePath('checkVersion.txt')
const MAX_TIME = 86400000

exports.checkVersion = function () {
  const nowTime = new Date().getTime()
  const lastTime = +fs.readFileSync(checkVersionPath).toString()

  if (lastTime && nowTime - lastTime <= MAX_TIME) {
    return
  }

  fs.writeFileSync(checkVersionPath, nowTime)

  const lastVersion = execSync('npm view vue-cli version', {
    encoding: 'utf8'
  })
  return lastVersion
}
