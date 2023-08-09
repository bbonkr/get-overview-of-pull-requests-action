import core from '@actions/core'
// import {RequestError} from '@octokit/types'
import {RequestError} from './request-error'

export const handleError = (err: unknown): void => {
  const octokitError = err as RequestError

  if (octokitError) {
    core.debug(`status: ${octokitError.status}, name: ${octokitError.name}`)
    core.startGroup(octokitError.name)

    if (octokitError.errors) {
      for (const oerr of octokitError.errors) {
        if (oerr.message) {
          core.error(oerr.message)
        }
      }
    }

    core.endGroup()
  } else {
    const error = err as Error
    if (error) {
      core.error(error.message)
    } else {
      core.error(`Unknown error: ${err}`)
    }
  }
}
