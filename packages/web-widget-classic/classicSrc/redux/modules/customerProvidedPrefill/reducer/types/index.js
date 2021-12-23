import { combineReducers } from 'redux'
import chatDepartmentSelect from './chatDepartmentSelect'
import chatVisitor from './chatVisitor'
import identify from './identify'
import prefill from './prefill'
import supportCustomFormFields from './supportCustomFormFields'
import supportFields from './supportFields'

const reducers = {
  prefill,
  identify,
  chatDepartmentSelect,
  chatVisitor,
  supportFields,
  supportCustomFormFields,
}

export default combineReducers(reducers)

export { reducers }
