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

  // Assert
  expect(result?.title).not.toBe('')
})

test('Should get related pulls with resolve keyword', async () => {
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
    limit: 10,
    appendResolveKeyword: true
  })

  // Assert
  expect(result?.title).not.toBe('')
  expect(result?.body).toContain('Resolve')
})

test('Should get related pulls without resolve keyword', async () => {
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
    limit: 10,
    appendResolveKeyword: false
  })

  // Assert
  expect(result?.title).not.toBe('')
  expect(result?.body).not.toContain('Resolve')
})
