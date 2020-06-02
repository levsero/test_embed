import React from 'react'
import { render } from 'src/util/testHelpers'
import { TEST_IDS } from 'src/constants/shared'

import SubmitButton from '../'

const defaultProps = {
  submitting: false,
  label: 'test label'
}
const renderComponent = (props = {}) => {
  return render(<SubmitButton {...defaultProps} {...props} />)
}

describe('SubmitButton', () => {
  it('button has type submit', () => {
    const { getByTestId } = renderComponent({ submitting: false })

    expect(getByTestId(TEST_IDS.BUTTON_OK)).toHaveAttribute('type', 'submit')
  })

  describe('when it is not submitting', () => {
    it('renders the label instead of dots', () => {
      const { getByText, queryByTestId } = renderComponent({ submitting: false })

      expect(getByText(defaultProps.label)).toBeInTheDocument()
      expect(queryByTestId(TEST_IDS.DOTS)).toBeNull()
    })
  })

  describe('when it is submitting', () => {
    it('renders dots instead of label', () => {
      const { getByTestId, queryByText } = renderComponent({ submitting: true })

      expect(getByTestId(TEST_IDS.DOTS)).toBeInTheDocument()
      expect(queryByText(defaultProps.label)).toBeNull()
    })
  })
})
