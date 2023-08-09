import {expect, test} from '@jest/globals'
import {getRepository} from '../src/get-repository'

test('Should get repository', async () => {
  // Arrange
  const owner = process.env.OWNER ?? ''
  const repo = process.env.REPO ?? ''
  const token = process.env.GH_TOKEN ?? ''

  // Act
  const result = await getRepository({owner, repo, token})

  // Assert
  expect(result?.owner).toBe(owner)
  expect(result?.repo).toBe(repo)
})
