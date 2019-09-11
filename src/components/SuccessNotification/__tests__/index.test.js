import SuccessNotification from '../'
import React from 'react'
import { render, getByTestId, fireEvent } from '@testing-library/react'
import createStore from 'src/redux/createStore'
import { Provider } from 'react-redux'

const onClickSpy = jest.fn()

const renderComponent = inProps => {
  const props = {
    onClick: onClickSpy,
    doneText: 'Doneski testski',
    icon: <div data-testid="OhLookeyHere" />,
    ...inProps
  }

  return render(
    <Provider store={createStore()}>
      <SuccessNotification {...props} />
    </Provider>
  )
}

describe('SuccessNotification', () => {
  it('renders text with `doneText` text', () => {
    const { getByText } = renderComponent()

    expect(getByText('Doneski testski')).toBeInTheDocument()
  })

  it('renders the `icon` prop', () => {
    const { container } = renderComponent()

    expect(getByTestId(container, 'OhLookeyHere')).toBeInTheDocument()
  })

  it('when doneText is clicked, calls onDone', () => {
    const { getByText } = renderComponent()

    expect(onClickSpy).not.toHaveBeenCalled()

    fireEvent.click(getByText('Doneski testski'))

    expect(onClickSpy).toHaveBeenCalled()
  })

  it('renders Heading', () => {
    const { getByText } = renderComponent()

    expect(getByText('Thanks for reaching out')).toBeInTheDocument()
  })

  it('renders Message', () => {
    const { getByText } = renderComponent()

    expect(getByText('Someone will get back to you soon')).toBeInTheDocument()
  })
})
