import {expect, test} from '@jest/globals'
import {getLatestPull} from '../src/get-latest-pull'

test('Should get latest pull', async () => {
  // Arrange

  const owner = process.env.OWNER ?? ''
  const repo = process.env.REPO ?? ''
  const token = process.env.GH_TOKEN ?? ''
  // Act
  const result = await getLatestPull({
    owner,
    repo,
    token,
    base: 'main',
    state: 'closed'
  })
  // Assert
  expect(result?.number).toBeGreaterThan(0)
})
