import React from 'react'
import { fireEvent } from '@testing-library/react'
import { render } from 'src/util/testHelpers'
import { TEST_IDS } from 'src/constants/shared'

import { Component as NoAgentsPage } from '../'

const renderComponent = (props = {}) => {
  const defaultProps = {
    title: "bob's burgers",
    onButtonClick: jest.fn(),
  }

  return render(<NoAgentsPage {...defaultProps} {...props} />)
}

describe('NoAgentsPage', () => {
  it('renders the title', () => {
    const { getByText } = renderComponent()

    expect(getByText("bob's burgers")).toBeInTheDocument()
  })

  it('renders the greeting', () => {
    const { getByTestId, getByText } = renderComponent()

    expect(getByTestId(TEST_IDS.FORM_GREETING_MSG)).toBeInTheDocument()
    expect(getByText('Sorry, we are not online at the moment')).toBeInTheDocument()
  })

  describe('Button', () => {
    it('renders expected label', () => {
      const { getByText } = renderComponent()

      expect(getByText('Close')).toBeInTheDocument()
    })

    it('fires onButtonClick on click', () => {
      const onButtonClick = jest.fn()
      const { getByText } = renderComponent({ onButtonClick })

      fireEvent.click(getByText('Close'))

      expect(onButtonClick).toHaveBeenCalled()
    })
  })
})
