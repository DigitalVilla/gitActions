const { replaceAsync, execAsync } = require('./utils')
const core = require('@actions/core')
const github = require('@actions/github')

async function main() {
  try {
    const scriptToRun = core.getInput('script')

    const env = process.env.GITHUB_ACTION_REF === 'master' ? 'prod' : 'dev'
    console.log(env)
    process.env.NODE_ENV = env

    let script = ''
    if (scriptToRun) {
      script = await execAsync(`yarn ${scriptToRun} --stage ${env}`)
    }

    const echo = await execAsync(`git log -2 --name-status `)
    console.log(echo.stdout)

    const printEnv = await execAsync(`git log -1 --name-status `)
    console.log(printEnv.stdout)

    core.setOutput('update', script.stdout)
    // Get the JSON webhook payload for the event that triggered the workflow
    const context = JSON.stringify(github, undefined, 2)
    console.log(`The event context: ${context}`)
  } catch (error) {
    core.setFailed(error.message)
  }
}

main()
