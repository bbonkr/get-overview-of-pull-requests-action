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
  status?: PrStatus
}

export const getLatestPull = async (
  getLatesPrsOptions: GetLatestPrsOptions
): Promise<GetLatestPrsResult | null> => {
  const {token, owner, repo, base, head, status} = getLatesPrsOptions

  try {
    const octokit = github.getOctokit(token)

    const {data} = await octokit.rest.pulls.list({
      owner,
      repo,
      base,
      head,
      state: status,
      sort: 'created',
      direction: 'desc',
      per_page: 1,
      page: 1
    })

    const firstItem = data?.find((_, index) => index === 0)
    if (firstItem) {
      return {
        number: firstItem.number,
        mergedAt: firstItem.merged_at
      }
    } else {
      core.warning(`Lasted Pr (base=${base}, head=${head}) not found`)

      return null
    }
  } catch (err: unknown) {
    handleError(err)
  }

  return null
}

export default getLatestPull
