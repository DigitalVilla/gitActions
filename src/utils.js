const fs = require('fs')
const { exec } = require('child_process')
const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function readAsync(message) {
  return new Promise((resolve, reject) => {
    rl.question(message, (answer) => {
      resolve(answer)
    })
  })
}

function closeReadAsync() {
  return rl.close()
}

function execAsync(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) return reject(error)
      return resolve({ stderr, stdout })
    })
  })
}

function replaceAsync(filePath, params) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', function (err, data) {
      if (err) return reject(err)
      for (const key in params) {
        data = data.replace(new RegExp(key, 'g'), params[key])
      }

      fs.writeFile(filePath, data, 'utf8', function (err) {
        if (err) return reject(err)
        return resolve(null)
      })
    })
  })
}

async function lastCommit(printLog = false) {
  let { stderr, stdout } = await execAsync('git log --name-status HEAD^..HEAD')
  if (stderr) throw new Error(stderr)

  const projects = {}
  let filePath = stdout.split('\n').map((e, i) => e.split('\t'))
  projects.hash = filePath[0][0].substring(0, 40)
  projects.message = filePath[0][0].substring(41)
  filePath = filePath.filter((el) => el.length === 2)

  for (let i = 0; i < filePath.length; i++) {
    const slash1 = filePath[i][1].indexOf('/')
    const root = filePath[i][1].substring(0, slash1) || 'root'
    const slash2 = filePath[i][1].indexOf('/', slash1 + 1)
    const appName = filePath[i][1].substring(slash1 + 1, slash2) || '.'
    const file = filePath[i][1].substring(slash2 + 1)

    if (!projects[root]) projects[root] = {}
    if (!projects[root][appName]) projects[root][appName] = []
    projects[root][appName].push([filePath[i][0], file])
  }

  if (printLog) {
    for (const key in projects) {
      console.log(key + ':', projects[key])
    }
  }

  return projects
}

module.exports = {
  execAsync,
  readAsync,
  lastCommit,
  replaceAsync,
  closeReadAsync,
}
