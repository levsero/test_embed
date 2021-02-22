import { wait } from '@testing-library/react'
import { render } from 'src/util/testHelpers'
import { SET_VISITOR_INFO_REQUEST_SUCCESS } from 'src/redux/modules/chat/chat-action-types'
import useOnChange from 'src/hooks/useOnChange'

jest.mock('react-final-form')

describe('useOnChange', () => {
  const ExampleComponent = ({ type, id, callback }) => {
    useOnChange(type, id, callback)
    return null
  }

  const renderComponent = (props = {}, options) => render(<ExampleComponent {...props} />, options)

  it('calls the callback when the watched value has changed', async () => {
    const callback = jest.fn()
    const { store } = renderComponent({ type: 'identify', id: 'prechatForm', callback })

    store.dispatch({
      type: SET_VISITOR_INFO_REQUEST_SUCCESS,
      payload: {
        timestamp: 123,
        name: 'Someone',
        email: 'someone@example.com',
      },
    })

    await wait(() =>
      expect(callback).toHaveBeenCalledWith({
        timestamp: 123,
        name: 'Someone',
        email: 'someone@example.com',
      })
    )

    store.dispatch({
      type: SET_VISITOR_INFO_REQUEST_SUCCESS,
      payload: {
        timestamp: 456,
        name: 'Another name',
      },
    })

    await wait(() =>
      expect(callback).toHaveBeenCalledWith({
        timestamp: 456,
        name: 'Another name',
        email: 'someone@example.com',
      })
    )
  })
})
