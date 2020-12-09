import { getElement } from './helpers'

const toAppearInOrder = async elements => {
  if (elements.length < 2) {
    return {
      message: () => `toAppearInOrder failed because less than two elements were provided to check`,
      pass: false
    }
  }

  for (let i = 1; i < elements.length; i++) {
    const element1 = await getElement(elements[i - 1])
    const element2 = await getElement(elements[i])

    if (!element1) {
      return {
        message: () =>
          `toAppearInOrder failed because it was not able to find element at position ${i - 1}`,
        pass: false
      }
    }

    if (!element2) {
      return {
        message: () =>
          `toAppearInOrder failed because it was not able to find element at position ${i}`,
        pass: false
      }
    }

    const box1 = await element1.boundingBox()
    const box2 = await element2.boundingBox()

    if (box1.y > box2.y) {
      return {
        message: () =>
          `expected elements to appear in order, but they weren't. Element ${i -
            1} appeared after ${i}`,
        pass: false
      }
    }
  }

  return {
    message: () => `expected elements to appear in order`,
    pass: true
  }
}

export default toAppearInOrder
