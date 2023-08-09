import * as core from '@actions/core'
import {GetRelatedPullsResult} from './get-related-pulls'
import {outputs} from './outputs'
import {GetLatestPrsResult} from './get-latest-pull'

type Model = GetRelatedPullsResult & GetLatestPrsResult

export const setOutputs = (model?: Model | null): void => {
  core.setOutput(outputs.title, model?.title ?? '')
  core.setOutput(outputs.body, model?.body ?? '')
  core.setOutput(outputs.labels, model?.labels ?? '')
  core.setOutput(outputs.assignees, model?.assignees ?? '')
  core.setOutput(outputs.reviewers, model?.reviewers ?? '')
  core.setOutput(outputs.milestone, model?.milestone ?? '')
  core.setOutput(outputs.pullNumber, `${model?.number?.toString() ?? ''}`)
}
