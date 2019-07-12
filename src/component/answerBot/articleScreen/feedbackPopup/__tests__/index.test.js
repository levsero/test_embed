import { render, fireEvent } from '@testing-library/react'
import React from 'react'

import FeedbackPopup from '../index'

const renderComponent = (props = {}) => {
  const defaultProps = {
    onYesClick: noop,
    onNoClick: noop,
    onReasonClick: noop
  }

  const componentProps = {
    ...defaultProps,
    ...props
  }

  return render(<FeedbackPopup {...componentProps} />)
}

test('renders the expected classes', () => {
  const { container } = renderComponent()

  expect(container).toMatchSnapshot()
})

test('fires the expected handler on yes click', () => {
  const onYesClick = jest.fn()
  const { getByText } = renderComponent({
    onYesClick
  })

  fireEvent.click(getByText('Yes'))
  expect(onYesClick).toHaveBeenCalled()
})

describe('on no click', () => {
  it('fires the expected handler', () => {
    const onNoClick = jest.fn()
    const { getByText } = renderComponent({
      onNoClick
    })

    fireEvent.click(getByText('No, I need help'))
    expect(onNoClick).toHaveBeenCalled()
  })

  it('displays the reasons', () => {
    const { container, getByText } = renderComponent()

    fireEvent.click(getByText('No, I need help'))
    expect(container).toMatchSnapshot()
  })

  describe('on reason click', () => {
    const onReasonClick = jest.fn()
    let getByText

    beforeEach(() => {
      const component = renderComponent({
        onReasonClick
      })

      getByText = component.getByText
      fireEvent.click(getByText('No, I need help'))
    })

    it('fires the expected handler on related reason click', () => {
      fireEvent.click(getByText("It's related, but it didn't answer my question"))
      expect(onReasonClick).toHaveBeenCalledWith(2)
    })

    it('fires the expected handler on unrelated reason click', () => {
      fireEvent.click(getByText("It's not related to my question"))
      expect(onReasonClick).toHaveBeenCalledWith(1)
    })
  })
})
