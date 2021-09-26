#!/usr/bin/env node

const { program } = require('commander')
const inquirer = require('inquirer')
const pkg = require('../package.json')
const semver = require('semver')
const chalk = require('chalk')
const ora = require('ora')

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

function checkNodeVersion (wanted, id) {
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
    inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: '请输入项目名称',
      },
    ]).then((answers) => {
      log('\nOrder receipt:')
      log(JSON.stringify(answers, null, '  '))
    })
  })

program.parse(process.argv)
