import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import createStore from 'src/redux/createStore'
import { useOnBack } from 'component/webWidget/OnBackProvider'
import * as selectors from 'src/redux/modules/selectors/selectors'
import BackButton from '../'

jest.mock('component/webWidget/OnBackProvider')

describe('BackButton', () => {
  const defaultProps = {
    onClick: undefined
  }

  const renderComponent = (props = {}) =>
    render(
      <Provider store={createStore()}>
        <BackButton {...defaultProps} {...props} />
      </Provider>
    )

  it('renders nothing when is not visible', () => {
    jest.spyOn(selectors, 'getShowBackButton').mockReturnValue(false)
    const { queryByLabelText } = renderComponent()

    expect(queryByLabelText('Back')).not.toBeInTheDocument()
  })

  describe('when visible', () => {
    beforeEach(() => {
      jest.spyOn(selectors, 'getShowBackButton').mockReturnValue(true)
    })

    it('renders when it is visible', () => {
      const { queryByLabelText } = renderComponent()

      expect(queryByLabelText('Back')).toBeInTheDocument()
    })

    it('calls onClick prop when it is provided', () => {
      const onClick = jest.fn()

      const { queryByLabelText } = renderComponent({ onClick })

      queryByLabelText('Back').click(0)

      expect(onClick).toHaveBeenCalled()
    })

    it('uses the useOnBack hook when onClick is not provided', () => {
      const onBack = jest.fn()
      useOnBack.mockReturnValue(onBack)

      const { queryByLabelText } = renderComponent()

      queryByLabelText('Back').click(0)

      expect(onBack).toHaveBeenCalled()
    })
  })
})
