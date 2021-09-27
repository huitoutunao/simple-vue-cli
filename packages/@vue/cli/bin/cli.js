#!/usr/bin/env node

const path = require('path')
const readline = require('readline')
const { program } = require('commander') // 命令行
const inquirer = require('inquirer') // 询问交互
const pkg = require('../package.json')
const semver = require('semver') // 判断 node 版本是否在某个范围
const chalk = require('chalk') // 彩色日志
const ora = require('ora') // 加载动画

const requiredVersion = require('../package.json').engines.node
const log = console.log

// const spinner = ora('Loading unicorns')
// spinner.start()
// setTimeout(() => {
// 	spinner.color = 'yellow'
// 	spinner.text = 'Loading rainbows'
//   spinner.stop()
// }, 1000)

log(`\n${process.version}`)

// 检查 node 版本
function checkNodeVersion(wanted, id) {
  if (!semver.satisfies(process.version, wanted, { includePrerelease: true })) {
    log(chalk.red(
      'You are using Node ' + process.version + ', but this version of ' + id +
      ' requires Node ' + wanted + '.\nPlease upgrade your Node version.'
    ))
    process.exit(1)
  }
}

checkNodeVersion(requiredVersion, 'vue-cli')

program
  .name('vue-cli')
  .version(`vue-cli ${pkg.version}`, '-v -version')
  .usage('<command> [options]')

program
  .command('create <name>')
  .description('请输入项目名称')
  .action(name => {
    const inCurrent = name === '.'
    const cwd = process.cwd() // 当前目录
    const newName = path.relative('../', cwd) // 相对路径

    console.log('相对路径', newName)
    console.log('当前工作目录', cwd)
    console.log('进程参数', process.argv)
    console.log('inCurrent', inCurrent)

    if (process.stdout.isTTY) {
      const blank = '\n'.repeat(process.stdout.rows)
      console.log('写入流', process.stdout)
      console.log('终端行数', process.stdout.rows)
      console.log(blank)
      readline.cursorTo(process.stdout, 0, 0)
      readline.clearScreenDown(process.stdout)
    }
    // inquirer.prompt([
    //   {
    //     type: 'input',
    //     name: 'name',
    //     message: '请输入项目名称',
    //   },
    // ]).then((answers) => {
    //   log('\nOrder receipt:')
    //   log(JSON.stringify(answers, null, '  '))
    // })
  })

program.parse(process.argv)
