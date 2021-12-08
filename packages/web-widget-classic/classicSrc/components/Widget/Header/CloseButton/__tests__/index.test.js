import { render, fireEvent } from '@testing-library/react'
import createStore from 'classicSrc/redux/createStore'
import * as actions from 'classicSrc/redux/modules/base'
import { Provider } from 'react-redux'
import CloseButton from '../'

jest.mock('classicSrc/redux/modules/base', () => ({
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
