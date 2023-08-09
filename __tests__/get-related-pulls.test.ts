import {expect, test} from '@jest/globals'
import {getRelatedPulls} from '../src/get-related-pulls'

test('Should get related pulls', async () => {
  // Arrange
  const owner = process.env.OWNER ?? ''
  const repo = process.env.REPO ?? ''
  const token = process.env.GH_TOKEN ?? ''
  // Act
  const result = await getRelatedPulls({
    owner,
    repo,
    token,
    base: 'main',
    limit: 10
  })

  console.debug('result: ', result)

  // Assert
  expect(result?.title).not.toBe('')
})
