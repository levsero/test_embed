import {
  CALLBACK_ONLY,
  PHONE_ONLY,
  CALLBACK_AND_PHONE,
  CLICK_TO_CALL,
  CAPABILITY_TYPE_CODES
} from '../talk-capability-types'

test('CALLBACK_ONLY', () => {
  expect(CALLBACK_ONLY).toEqual('widget/talk/CALLBACK_ONLY')
})

test('PHONE_ONLY', () => {
  expect(PHONE_ONLY).toEqual('widget/talk/PHONE_ONLY')
})

test('CALLBACK_AND_PHONE', () => {
  expect(CALLBACK_AND_PHONE).toEqual('widget/talk/CALLBACK_AND_PHONE')
})

test('CLICK_TO_CALL', () => {
  expect(CLICK_TO_CALL).toEqual('widget/talk/CLICK_TO_CALL')
})

test('CAPABILITY_TYPE_CODES', () => {
  expect(CAPABILITY_TYPE_CODES.CALLBACK_ONLY).toEqual(0)
  expect(CAPABILITY_TYPE_CODES.PHONE_ONLY).toEqual(1)
  expect(CAPABILITY_TYPE_CODES.CALLBACK_AND_PHONE).toEqual(2)
  expect(CAPABILITY_TYPE_CODES.CLICK_TO_CALL).toEqual(3)
})
