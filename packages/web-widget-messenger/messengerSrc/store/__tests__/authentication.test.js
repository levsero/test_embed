import { loginUser as loginUserSunco, logoutUser as logoutUserSunco } from 'messengerSrc/api/sunco'
import createStore from 'messengerSrc/store'
import { loginUser, logoutUser } from '../authentication'

jest.mock('messengerSrc/api/sunco')

describe('integration store', () => {
  it('calls loginUser from Sunco API when loginUser dispatches', async () => {
    const store = createStore()
    await store.dispatch(loginUser())

    expect(loginUserSunco).toHaveBeenCalled()
  })

  it('calls loginUser Sunco API when logoutUser dispatches', async () => {
    const store = createStore()
    await store.dispatch(logoutUser())

    expect(logoutUserSunco).toHaveBeenCalled()
  })
})
