import _ from 'lodash'
import {
  getContactDetailsSubmissionError,
  getChatVisitor,
  getDepartment,
  getIsAuthenticated,
} from 'src/embeds/chat/selectors'
import {
  clearDepartment,
  handlePrechatFormSubmit,
  sendMsg,
  sendOfflineMessage,
  setDepartment,
  setVisitorInfo,
  updateChatScreen,
} from 'src/redux/modules/chat'
import * as screens from 'src/redux/modules/chat/chat-screen-types'

const submitPrechatForm = ({ values: rawValues, isDepartmentFieldVisible }) => async (
  dispatch,
  getState
) => {
  const values = { ...rawValues }
  const department = getDepartment(getState(), values.department)

  if (getIsAuthenticated(getState())) {
    const visitor = getChatVisitor(getState())
    Object.assign(values, {
      name: visitor.display_name,
      email: visitor.email,
    })
  }

  if (department && department.status === 'offline') {
    dispatch(
      sendOfflineMessage(
        values,
        () => dispatch(updateChatScreen(screens.OFFLINE_MESSAGE_SUCCESS_SCREEN)),
        () => dispatch(updateChatScreen(screens.PRECHAT_SCREEN))
      )
    )
    return
  }

  if (values.display_name || values.name || values.email || values.phone) {
    await dispatch(
      setVisitorInfo({
        visitor: _.omitBy(
          {
            display_name: values.display_name || values.name,
            email: values.email,
            phone: values.phone,
          },
          _.isNil
        ),
        identifier: 'prechat form',
      })
    )
    if (getContactDetailsSubmissionError(getState())) {
      throw new Error('failed to submit details')
    }
  }

  if (isDepartmentFieldVisible) {
    if (department) {
      await new Promise((res) => {
        dispatch(setDepartment(department.id, res, res))
      })
    } else {
      await new Promise((res) => {
        dispatch(clearDepartment(res))
      })
    }
  }

  if (values.message) {
    dispatch(sendMsg(values.message))
  }

  dispatch(handlePrechatFormSubmit(values))
}

export { submitPrechatForm }
