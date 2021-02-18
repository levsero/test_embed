import Footer from '../'
import React from 'react'
import { fireEvent } from '@testing-library/react'
import { TEST_IDS } from 'src/constants/shared'
import { render } from 'utility/testHelpers'
import { getByTestId } from '@testing-library/dom'

const onClickSpy = jest.fn()

const renderComponent = (inProps) => {
  const props = {
    label: 'testLabel',
    onClick: onClickSpy,
    ...inProps,
  }
  return render(<Footer {...props} />)
}

describe('Footer', () => {
  describe('default render', () => {
    it('renders label', () => {
      expect(renderComponent().getByText('testLabel')).toBeInTheDocument()
    })

    it('when button is clicked, calls onClickSpy', () => {
      const result = renderComponent()

      expect(onClickSpy).not.toHaveBeenCalled()

      fireEvent.click(result.getByText('testLabel'))

      expect(onClickSpy).toHaveBeenCalled()
    })

    it('renders zendesk logo', () => {
      const { container } = renderComponent()

      expect(getByTestId(container, TEST_IDS.ICON_ZENDESK)).toBeInTheDocument()
    })
  })

  describe('label', () => {
    it('renders customized label', () => {
      expect(renderComponent({ label: 'blaaah' }).getByText('blaaah')).toBeInTheDocument()
    })
  })
})
