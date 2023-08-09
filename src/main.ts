import * as core from '@actions/core'
import * as github from '@actions/github'
import {inputs} from './inputs'
import getLatestPull from './get-latest-pull'
import getRepository from './get-repository'
import getRelatedPulls from './get-related-pulls'
import {setOutputs} from './set-outputs'

async function run(): Promise<void> {
  const token = core.getInput(inputs.githubToken)
  const base = core.getInput(inputs.base)
  const head = core.getInput(inputs.head)
  let owner = core.getInput(inputs.owner)
  let repo = core.getInput(inputs.repo)
  let defaultBranch = core.getInput(inputs.defaultBranch)

  try {
    if (!token) {
      throw new Error('Token is required')
    }

    if (!base) {
      throw new Error('Base is required')
    }
    if (!head) {
      throw new Error('Head is required')
    }

    if (!owner) {
      owner = github.context.repo.owner
    }

    if (!repo) {
      repo = github.context.repo.repo
    }

    if (!defaultBranch) {
      const repository = await getRepository({token, owner, repo})
      if (repository) {
        defaultBranch = repository.defaultBranch
      }
    }

    core.info(
      `Try to generate overview of pull request which is ${base} ⬅️ ${head}`
    )

    const latestPullRequest = await getLatestPull({
      token,
      owner,
      repo,
      base,
      head,
      state: 'closed'
    })

    const latestPullRequestMergedAt = latestPullRequest?.mergedAt
      ? new Date(latestPullRequest.mergedAt)
      : undefined

    const getRelatedPrsResult = await getRelatedPulls({
      token,
      owner,
      repo,
      base: defaultBranch,
      mergedAfter: latestPullRequestMergedAt
    })

    const openedPull = await getLatestPull({
      token,
      owner,
      repo,
      base,
      head,
      state: 'open'
    })

    setOutputs({...getRelatedPrsResult, ...openedPull})
  } catch (error: unknown) {
    setOutputs()
    if (error instanceof Error) {
      core.setFailed(error.message)
    } else {
      core.setFailed('Unknown error occurred.')
    }
  }
}

run()
