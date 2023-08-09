import * as core from '@actions/core'
import * as github from '@actions/github'
import {handleError} from './handle-error'

type GetRepositoryOptions = {
  token: string
  owner: string
  repo: string
}

type GetRepositoryResult = {
  owner: string
  repo: string
  defaultBranch: string
}

export const getRepository = async (
  options: GetRepositoryOptions
): Promise<GetRepositoryResult | null> => {
  const {token, owner, repo} = options

  try {
    const octokit = github.getOctokit(token)

    core.debug('Try to get repository information')

    const {data} = await octokit.rest.repos.get({owner, repo})

    core.debug(`Found ${data.full_name}`)
    return {
      owner,
      repo,
      defaultBranch: data.default_branch
    }
  } catch (err) {
    handleError(err)
  }

  return null
}

export default getRepository
