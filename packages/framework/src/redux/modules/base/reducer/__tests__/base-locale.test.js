import { testReducer } from 'src/util/testHelpers'
import { LOCALE_SET } from '../../base-action-types'
import locale from '../base-locale'

testReducer(locale, [
  {
    action: { type: undefined },
    expected: '',
  },
  {
    action: { type: 'DERP DERP' },
    initialState: 'ar',
    expected: 'ar',
  },
  {
    action: { type: LOCALE_SET, payload: 'fr' },
    expected: 'fr',
  },
])
