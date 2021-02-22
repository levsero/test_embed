import { render, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import createStore from 'src/redux/createStore'
import * as actions from 'src/redux/modules/base'
import CloseButton from '../'

jest.mock('src/redux/modules/base', () => ({
  handleCloseButtonClicked: jest.fn(() => 'handleCloseButtonClicked'),
}))

describe('CloseButton', () => {
  const defaultProps = {
    onClick: undefined,
  }

  const renderComponent = (props = {}) => {
    const store = createStore()
    store.dispatch = jest.fn()

    const result = render(
      <Provider store={store}>
        <CloseButton {...defaultProps} {...props} />
      </Provider>
    )

    return {
      ...result,
      store,
    }
  }

  beforeEach(() => {
    jest.spyOn(actions, 'handleCloseButtonClicked')
  })

  it('calls onClick prop when it is provided', () => {
    const onClick = jest.fn()

    const { getByLabelText } = renderComponent({ onClick })

    fireEvent.click(getByLabelText('Minimize widget'))

    expect(onClick).toHaveBeenCalled()
  })

  it('dispatches a "handleCloseButtonClicked" action when onClick is not provided', () => {
    const { getByLabelText, store } = renderComponent()

    fireEvent.click(getByLabelText('Minimize widget'))

    expect(store.dispatch).toHaveBeenCalledWith(actions.handleCloseButtonClicked())
  })
})
