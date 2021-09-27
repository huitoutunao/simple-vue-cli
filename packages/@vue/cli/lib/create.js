const fs = require('fs-extra') // 操作系统文件的方法
const path = require('path')
const semver = require('semver') // 判断 node 版本是否在某个范围
const inquirer = require('inquirer') // 询问交互
const chalk = require('chalk') // 彩色日志
const ora = require('ora') // 加载动画
const validateProjectName = require('validate-npm-package-name') // 验证包名合法性
const { clearConsole } = require('./util/clearConsole')

async function create(projectName) {
  console.log('项目mc', projectName)
  const cwd = process.cwd()
  const inCurrent = projectName === '.'
  const name = inCurrent ? path.relative('../', cwd) : projectName
  const targetDir = path.resolve(cwd, projectName)
  const result = validateProjectName(name)

  if (!result.validForNewPackages) {
    console.error(chalk.red(`项目名称无效: "${name}"`))
    result.errors && result.errors.forEach(err => {
      console.error(chalk.red.dim(`Error: ${err}`))
    })
    result.warnings && result.warnings.forEach(warn => {
      console.error(chalk.red.dim(`Warning: ${warn}`))
    })
    process.exit(1)
  }

  if (fs.existsSync(targetDir)) {
    clearConsole()
    if (inCurrent) {
      const { ok } = await inquirer.prompt([
        {
          name: 'ok',
          type: 'confirm',
          message: '是否在当前目录生成项目？'
        }
      ])
      if (!ok) {
        return
      }
    } else {
      const { action } = await inquirer.prompt([
        {
          name: 'action',
          type: 'list',
          message: `当前目录 ${chalk.cyan(targetDir)} 已经存在。请选择以下操作：`,
          choices: [
            { name: 'Overwrite', value: 'overwrite' },
            { name: 'Merge', value: 'merge' },
            { name: 'Cancel', value: false }
          ]
        }
      ])
      if (!action) {
        return
      } else if (action === 'overwrite') {
        console.log(`\nRemoving ${chalk.cyan(targetDir)}...`)
        await fs.remove(targetDir)
      }
    }
  }
}

module.exports = (...args) => {
  return create(...args)
}
