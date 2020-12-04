import { combineReducers } from 'redux'
import prefill from './prefill'
import identify from './identify'
import chatDepartmentSelect from './chatDepartmentSelect'
import supportFields from './supportFields'
import supportCustomFormFields from './supportCustomFormFields'
import chatVisitor from './chatVisitor'

const reducers = {
  prefill,
  identify,
  chatDepartmentSelect,
  chatVisitor,
  supportFields,
  supportCustomFormFields
}

export default combineReducers(reducers)

export { reducers }
