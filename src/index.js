const { replaceAsync, execAsync } = require('./utils')
const core = require('@actions/core')
const github = require('@actions/github')

async function main() {
  try {
    const nameToGreet = core.getInput('script')
    console.log(nameToGreet)
    console.log(process.env)

    const echo = await execAsync(`ls && pwd && git log`)
    console.log(echo.stdout)

    const printEnv = await execAsync(`git log -1 --name-status `)
    console.log(printEnv.stdout)

    core.setOutput('update', echo.stdout)
    // Get the JSON webhook payload for the event that triggered the workflow
    const context = JSON.stringify(github, undefined, 2)
    console.log(`The event context: ${context}`)
  } catch (error) {
    core.setFailed(error.message)
  }
}

main()
