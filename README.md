# Get overview of pull requests

GitHub action which is getting overview of pull requests.

## Usages

You can use this action as below.

```yaml
name: 'PR completed'

on: # rebuild any PRs and main branch changes
  pull_request:
    types: ['closed']

permissions:
  contents: write
  pull-requests: write

env:
  MAIN_BRANCH_NAME: main
  PROJECT_NAME: ''

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      # ... build workflow

  create-tag:
    needs: [build] # build job is completed as success
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      # ... more steps

      - name: 'get next version name'
        uses: bbonkr/next-version-proposal-action@v1
        id: next_version_proposal
        with:
          github_token: ${{ github.token }}
          pr: ${{ github.event.pull_request.number }}
          major_labels: 'major,next'
          minor_labels: 'enhancement,feature'
          patch_labels: 'bug,documentation,chore,dependencies'
          next_version_prefix: 'v'

      - name: 'Create tag'
        uses: rickstaa/action-create-tag@v1
        if: ${{ steps.next_version_proposal.outputs.next_version != '' }}
        with:
          tag: '${{ steps.next_version_proposal.outputs.next_version }}'
          message: 'New release ${{ steps.next_version_proposal.outputs.next_version }}'
          commit_sha: ${{ github.sha }}

      - name: create GitHub Release
        id: release_drafter
        uses: release-drafter/release-drafter@v5
        if: ${{ steps.next_version_proposal.outputs.next_version != '' }}
        with:
          config-name: release-drafter.yml
          version: ${{ steps.next_version_proposal.outputs.next_version }}
          publish: false
          prerelease: false
        env:
          GITHUB_TOKEN: ${{ github.token }}

      - name: git tag skipped
        if: ${{ steps.next_version_proposal.outputs.next_version == '' }}
        run: |
          echo "Next version tag is empty."

      - name: Get overview of PR
        uses: bbonkr/get-overview-of-pull-requests-action@v1
        id: get_overview
        with:
          github_token: ${{ github.token }}
          base: main
          head: ${{ github.event.pull_request.base.ref }}
          default_branch: dev

      - name: logging
        run: |
          echo "title:       ${{ steps.get_overview.outputs.title }}"
          echo "body:        ${{ steps.get_overview.outputs.body }}"
          echo "labels:      ${{ steps.get_overview.outputs.labels }}"
          echo "milestone:   ${{ steps.get_overview.outputs.milestone }}"
          echo "assignees:   ${{ steps.get_overview.outputs.assignees }}"
          echo "reviewers:   ${{ steps.get_overview.outputs.reviewers }}"
          echo "pull_number: ${{ steps.get_overview.outputs.pull_number }}"

      - name: Create pull
        if: ${{ steps.get_overview.outputs.pull_number == '' }}
        run: |
          gh pr create --base ${{ env.MAIN_BRANCH_NAME }} \
            --head ${{ github.event.pull_request.base.ref }} \
            --label '${{ steps.get_overview.outputs.labels }}' \
            --project '${{ env.PROJECT_NAME }}' \
            --reviewer ${{ steps.get_overview.outputs.reviewers }} \
            --assignee ${{ steps.get_overview.outputs.assignees }} \
            --body '${{ steps.get_overview.outputs.body }}' \
            --title '${{ env.MAIN_BRANCH_NAME }}'
        env:
          GITHUB_TOKEN: ${{ github.token }}

      - name: Update pull
        if: ${{ steps.get_overview.outputs.pull_number != '' }}
        run: |
          gh pr edit ${{ env.MAIN_BRANCH_NAME }} \
            --body '${{ steps.get_overview.outputs.body }}' \
            --title '${{ env.MAIN_BRANCH_NAME }}' \
            --add-label '${{ steps.get_overview.outputs.labels }}'
        env:
          GITHUB_TOKEN: ${{ github.token }}
```

> Please see pull request which generated by this action.
>
> - [Example pull request](https://github.com/bbonkr/get-overview-of-pull-requests-action/pull/15)

### Inputs

| Name           | Required | Description                                                                    |
| :------------- | :------: | :----------------------------------------------------------------------------- |
| github_token   |    ✅    | GitHub Personal Access Token. It requires REPO scope.                          |
| base           |    ✅    | Base branch name of pull request                                               |
| head           |    ✅    | Head branch name of pull request                                               |
| default_branch |          | Branch name which collects informations; default: default branch of repository |
| owner          |          | Name of repository owner, For test. You does not need this input.              |
| repo           |          | Repository name; For test. You does not need this input.                       |

### outputs

| Name        | Description                                     |
| :---------- | :---------------------------------------------- |
| title       | Title of pull request                           |
| body        | Body of pull request                            |
| labels      | A comma-separated list of label names           |
| milestone   | Milestone                                       |
| assignees   | A comma-separated list of assignee logins       |
| reviewers   | A comma-separated list of reviewer logins       |
| pull_number | Pull request number of base branch if it exists |
