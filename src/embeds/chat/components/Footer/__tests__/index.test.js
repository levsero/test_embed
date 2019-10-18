import Footer from '../'
import React from 'react'
import { fireEvent } from '@testing-library/react'
import { TEST_IDS } from 'src/constants/shared'
import { render } from 'utility/testHelpers'

const onClickSpy = jest.fn()

const renderComponent = inProps => {
  const props = {
    label: 'testLabel',
    onClick: onClickSpy,
    ...inProps
  }
  return render(<Footer {...props} />)
}

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
    const { queryByTestId } = renderComponent()

    expect(queryByTestId(TEST_IDS.ICON_ZENDESK)).toBeInTheDocument()
  })
})

describe('hideZendeskLogo is true', () => {
  it('does not render zendeskLogo', () => {
    const { queryByTestId } = renderComponent({ hideZendeskLogo: true })

    expect(queryByTestId(TEST_IDS.ICON_ZENDESK)).toBeNull()
  })
})

describe('label', () => {
  it('renders customized label', () => {
    expect(renderComponent({ label: 'blaaah' }).getByText('blaaah')).toBeInTheDocument()
  })
})
