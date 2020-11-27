const { replaceAsync, execAsync } = require('./utils')
const core = require('@actions/core')
// const github = require('@actions/github')

async function main() {
  try {
    const appName = core.getInput('app')

    let script = await execAsync(`yarn add scripty -D && npm i -g serverless`)
    console.log(sls.stdout)
    script = await execAsync(
      `serverless config credentials --provider aws --key ${process.env.AWS_ACCESS_KEY_ID} --secret ${process.env.AWS_SECRET_ACCESS_KEY}`
    )
    console.log(sls.stdout)

    const env = process.env.GITHUB_REF.indexOf('master') > 0 ? 'prod' : 'dev'
    process.env.NODE_ENV = env
    console.log(process.env)

    if (appName.length) {
      console.log(`Deploying app=${appName} env=${env}`)
      script = await execAsync(`yarn sls:test ${appName} --stage ${env}`)
    }

    core.setOutput('update', script.stdout)
    core.setOutput('env', process.env)
    // Get the JSON webhook payload for the event that triggered the workflow
    // const context = JSON.stringify(github.ref, undefined, 2)
    // console.log(`The event context: ${context}`)
  } catch (error) {
    core.setFailed(error.message)
  }
}

main()
