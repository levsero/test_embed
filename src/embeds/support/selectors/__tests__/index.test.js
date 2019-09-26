import {
  getSupportConfig,
  getNewSupportEmbedEnabled,
  getMaxFileCount,
  getMaxFileSize
} from '../index'

const state = {
  support: {
    config: {
      yolo: 'yolo',
      maxFileCount: 10,
      maxFileSize: 5,
      webWidgetReactRouterSupport: true
    }
  }
}

test('getSupportConfig', () => {
  const result = getSupportConfig(state)

  expect(result).toEqual({
    yolo: 'yolo',
    maxFileCount: 10,
    maxFileSize: 5,
    webWidgetReactRouterSupport: true
  })
})

test('getNewSupportEmbedEnabled', () => {
  const result = getNewSupportEmbedEnabled(state)

  expect(result).toEqual(true)
})

test('getMaxFileSize', () => {
  const result = getMaxFileSize(state)

  expect(result).toEqual(5)
})

test('getMaxFileCount', () => {
  const result = getMaxFileCount(state)

  expect(result).toEqual(10)
})
