import { isPopout } from '@zendesk/widget-shared-services'
import { testReducer } from 'src/util/testHelpers'
import { UPDATE_WIDGET_SHOWN, API_RESET_WIDGET, WIDGET_INITIALISED } from '../../base-action-types'
import embedShown from '../base-embed-shown'

jest.mock('@zendesk/widget-shared-services', () => {
  const originalModule = jest.requireActual('@zendesk/widget-shared-services')

  return {
    __esModule: true,
    ...originalModule,
    isPopout: jest.fn(),
  }
})
testReducer(embedShown, [
  {
    action: { type: undefined },
    expected: false,
  },
  {
    action: { type: 'DERP DERP' },
    initialState: true,
    expected: true,
  },
  {
    action: { type: API_RESET_WIDGET },
    expected: false,
  },
  {
    action: { type: UPDATE_WIDGET_SHOWN, payload: false },
    initialState: true,
    expected: false,
  },
])

describe('WIDGET_INITIALISED', () => {
  it('returns false if not popout', () => {
    isPopout.mockReturnValue(false)
    expect(embedShown(undefined, { type: WIDGET_INITIALISED })).toEqual(false)
  })

  it('returns true if popout', () => {
    isPopout.mockReturnValue(true)
    expect(embedShown(undefined, { type: WIDGET_INITIALISED })).toEqual(true)
  })
})
