import { testReducer } from 'src/util/testHelpers'
import labelSettings from '../'

testReducer(labelSettings, [
  {
    expected: { chatLabel: null, label: null, talkLabel: null }
  }
])
