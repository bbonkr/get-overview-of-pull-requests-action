import {expect, test} from '@jest/globals'
import {setOutputs} from '../src/set-outputs'

test('Should not occur exception even argument is null', async () => {
  // Arrange
  setOutputs()
})

test('Should not occur exception even argument is null #2', async () => {
  // Arrange
  setOutputs(null)
})

test('Should not occur exception even argument is null #3', async () => {
  // Arrange
  setOutputs(undefined)
})

test('Should not occur exception even argument is null #3', async () => {
  // Arrange
  setOutputs({
    title: 'test',
    number: 900
  })
})
