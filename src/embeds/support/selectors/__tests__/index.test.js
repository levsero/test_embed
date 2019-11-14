import {
  getSupportConfig,
  getNewSupportEmbedEnabled,
  getMaxFileCount,
  getMaxFileSize,
  getActiveFormName,
  getFormState
} from '../index'

const state = {
  support: {
    config: {
      yolo: 'yolo',
      maxFileCount: 10,
      maxFileSize: 5,
      webWidgetReactRouterSupport: true
    },
    activeFormName: 'ticketForm',
    formStates: { contactForm: { name: 'Bobby' } },
    showFormErrors: 'blap'
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

test('getActiveFormName', () => {
  const result = getActiveFormName(state)

  expect(result).toEqual('ticketForm')
})

test('getFormState', () => {
  const result = getFormState(state, 'contactForm')

  expect(result).toEqual({ name: 'Bobby' })
})
