import { combineReducers } from 'redux'
import prefill from './prefill'
import identify from './identify'
import chatDepartmentSelect from './chatDepartmentSelect'

export default combineReducers({
  prefill,
  identify,
  chatDepartmentSelect
})
