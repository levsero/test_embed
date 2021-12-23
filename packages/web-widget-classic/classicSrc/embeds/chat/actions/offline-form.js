import { sendOfflineMessage } from 'classicSrc/redux/modules/chat'

const submitOfflineForm = (formState, authenticatedValues = {}) => async (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(sendOfflineMessage({ ...formState, ...authenticatedValues }, resolve, reject))
  })

export { submitOfflineForm }
