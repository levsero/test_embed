import Footer from '../'
import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { TEST_IDS } from 'src/constants/shared'
import { getByTestId, queryByTestId } from '@testing-library/dom'

import createStore from 'src/redux/createStore'
import { Provider } from 'react-redux'

const onClickSpy = jest.fn()

const renderComponent = inProps => {
  const props = {
    label: 'testLabel',
    onClick: onClickSpy,
    ...inProps
  }

  return render(
    <Provider store={createStore()}>
      <Footer {...props} />
    </Provider>
  )
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
    const { container } = renderComponent()

    expect(getByTestId(container, TEST_IDS.ICON_ZENDESK)).toBeInTheDocument()
  })
})

describe('hideZendeskLogo is true', () => {
  it('does not render zendeskLogo', () => {
    const { container } = renderComponent({ hideZendeskLogo: true })

    expect(queryByTestId(container, TEST_IDS.ICON_ZENDESK)).toBeNull()
  })
})

describe('label', () => {
  it('renders customized label', () => {
    expect(renderComponent({ label: 'blaaah' }).getByText('blaaah')).toBeInTheDocument()
  })
})
