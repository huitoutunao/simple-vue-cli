#!/usr/bin/env node

const path = require('path')
const pkg = require('../package.json')
const fs = require('fs-extra')
const { program } = require('commander') // 命令行
const inquirer = require('inquirer') // 询问交互
const semver = require('semver') // 判断 node 版本是否在某个范围
const chalk = require('chalk') // 彩色日志
const ora = require('ora') // 加载动画
const download = require('download-git-repo') // 拉取模板
const validateProjectName = require('validate-npm-package-name') // 验证包名合法性
const { checkVersion } = require('../util/checkVersion')
const { clearConsole } = require('../util/clearConsole')

const requiredVersion = pkg.engines.node
const log = console.log
const loading = ora({
  color: 'green',
  text: '加载中'
})

// 检查 node 版本
const checkNodeVersion = (wanted, id) => {
  if (!semver.satisfies(process.version, wanted, { includePrerelease: true })) {
    log(chalk.red(
      'You are using Node ' + process.version + ', but this version of ' + id +
      ' requires Node ' + wanted + '.\nPlease upgrade your Node version.'
    ))
    process.exit(1)
  }
}

checkNodeVersion(requiredVersion, 'httn-cli')

const tmpTab = {
  VueBase: 'master',
  VueMobile: 'vue2-mobile'
}

const downloadAdress = (tmp) => `huitoutunao/webpack-vue-template#${tmpTab[tmp]}`

const downloadCallBack = (answer, targetDir, err) => {
  loading.stop()

  if (err) {
    log('拉取模板失败！')
    return
  }

  const filename = path.join(targetDir, 'package.json')
  if (fs.existsSync(filename)) {
    let newPkgJson = fs.readFileSync(filename).toString()

    newPkgJson = JSON.parse(newPkgJson)

    newPkgJson.name = answer.name
    newPkgJson.author = answer.author
    newPkgJson.description = answer.description

    newPkgJson = JSON.stringify(newPkgJson, null, '\t')

    fs.writeFileSync(filename, newPkgJson)

    log('拉取模板成功！')
    log(`\n`)
    log(chalk.green(`第一步：$ cd ${answer.name}`))
    log(chalk.green(`第二步：$ yarn install or npm install`))
    log(chalk.green(`第三步：$ npm run serve`))
  }
}

program
  .name('httn-cli')
  .version(`httn-cli ${pkg.version}`, '-v --version')
  .usage('<command> [options]')

program
  .command('create <app-name>')
  .description('创建项目')
  .action(async (projectName) => {
    const latest = checkVersion()
    if (latest && semver.gt(latest, pkg.version)) {
      log(chalk.red(`当前版本过低，请及时更新版本至${latest}`))
      process.exit(1)
    }

    const inCurrent = projectName === '.'
    const cwd = process.cwd() // 当前目录
    const newName = inCurrent ? path.relative('../', cwd) : projectName
    const targetDir = path.resolve(cwd, projectName)
    const validateResult = validateProjectName(newName)

    if (!validateResult.validForNewPackages) {
      console.error(chalk.red(`Invalid project name: "${projectName}"`))
      validateResult.errors && validateResult.errors.forEach(err => {
        console.error(chalk.red.dim(`Error: ${err}`))
      })
      validateResult.warnings && validateResult.warnings.forEach(warn => {
        console.error(chalk.red.dim(`Warning: ${warn}`))
      })
      process.exit(1)
    }

    clearConsole()
    const answer = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: '请输入项目名称',
      },
      {
        type: 'input',
        name: 'author',
        message: '请输入项目作者名',
      },
      {
        type: 'input',
        name: 'description',
        message: '请输入项目简介',
      },
      {
        type: 'list',
        message: '使用哪种模板开发',
        name: 'tmp',
        choices: ['VueBase', 'VueMobile'],
      }
    ])

    download(downloadAdress(answer.tmp), targetDir, downloadCallBack.bind(null, answer, targetDir))

    loading.color = 'green'
    loading.text = '正在拉取模板'
    loading.start()
  })

program.parse(process.argv)
