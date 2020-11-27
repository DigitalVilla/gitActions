const { replaceAsync, execAsync } = require('./utils')
const core = require('@actions/core')
const github = require('@actions/github')

async function main() {
  try {
    const scriptToRun = core.getInput('script')

    const sls = await execAsync(`npm i -g serverless`)
    console.log(sls.stdout)

    const env = process.env.GITHUB_REF.indexOf('master') > 0 ? 'prod' : 'dev'
    process.env.NODE_ENV = env
    console.log(process.env)

    let script = ''

    if (scriptToRun.length) {
      console.log(`Deploying ${scriptToRun.split(' '[0])}`)
      script = await execAsync(`yarn ${scriptToRun} --stage ${env}`)
    }

    core.setOutput('update', script.stdout)
    core.setOutput('env', process.env)
    // Get the JSON webhook payload for the event that triggered the workflow
    const context = JSON.stringify(github.ref, undefined, 2)
    console.log(`The event context: ${context}`)
  } catch (error) {
    core.setFailed(error.message)
  }
}

main()
