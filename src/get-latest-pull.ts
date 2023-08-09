import * as core from '@actions/core'
import * as github from '@actions/github'
import {handleError} from './handle-error'
import {PrStatus} from './pr-status'

export const GetLatestPrOutputs = {
  number: 'latest_pr_number',
  mergedAt: 'latest_pr_merged_at'
}

export type GetLatestPrsResult = {
  number?: number
  mergedAt?: string | null
}

type GetLatestPrsOptions = {
  token: string
  owner: string
  repo: string
  base?: string
  head?: string
  state?: PrStatus
}

export const getLatestPull = async (
  options: GetLatestPrsOptions
): Promise<GetLatestPrsResult | null> => {
  const {token, owner, repo, base, head, state} = options

  try {
    const octokit = github.getOctokit(token)

    const stateQuery = state ? `is:${state}` : ''
    const baseQuery = base ? `base:${base}` : ''
    const headQuery = head ? `head:${head}` : ''

    const query = [
      stateQuery,
      baseQuery,
      headQuery,
      'is:pr',
      `repo:${owner}/${repo}`
    ]
      .filter(Boolean)
      .join(' ')

    const {data: pulls} = await octokit.rest.search.issuesAndPullRequests({
      sort: 'created',
      order: 'desc',
      page: 1,
      per_page: 1,
      q: query
    })

    const firstItem = pulls?.items.find((_, index) => index === 0)
    if (firstItem) {
      const {data} = await octokit.rest.pulls.get({
        owner,
        repo,
        pull_number: firstItem.number
      })

      if (data) {
        return {
          number: data.number,
          mergedAt: data.merged_at
        }
      }
    }

    core.warning(`Lasted Pr (base=${base}, head=${head}) not found`)

    return null
  } catch (err: unknown) {
    handleError(err)
  }

  return null
}

export default getLatestPull
