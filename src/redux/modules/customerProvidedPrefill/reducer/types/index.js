import { combineReducers } from 'redux'
import prefill from './prefill'
import identify from './identify'
import chatDepartmentSelect from './chatDepartmentSelect'
import supportFields from './supportFields'
import supportCustomFormFields from './supportCustomFormFields'

const reducers = {
  prefill,
  identify,
  chatDepartmentSelect,
  supportFields,
  supportCustomFormFields
}

export default combineReducers(reducers)

export { reducers }
