jest.mock('src/redux/modules/talk/talk-selectors')

import React from 'react'
import { fireEvent } from '@testing-library/react'

import { render } from 'utility/testHelpers'
import { Component as ClickToCallPage } from '..'

const renderComponent = props => render(<ClickToCallPage {...props} />)

describe('when the user starts a call', () => {
  it('calls the snapcall start call function', () => {
    const startCall = jest.fn()
    window.snapcallAPI = { startCall }
    const { getByText } = renderComponent({
      title: 'Call Us',
      buttonId: '1234'
    })

    fireEvent.click(getByText('Start Call'))

    expect(window.snapcallAPI.startCall).toHaveBeenCalledWith('1234')
  })
})

describe('when there is an average wait time', () => {
  it('renders the page with the average wait time component', () => {
    const { getByText } = renderComponent({
      averageWaitTime: 'Average wait time: 10 minutes',
      title: 'Call Us'
    })

    expect(getByText('Average wait time: 10 minutes')).toBeInTheDocument()
  })
})

describe('when there is no average wait time', () => {
  it('renders the page with the average wait time component', () => {
    const { queryByText } = renderComponent({
      averageWaitTime: null,
      title: 'Call Us'
    })

    expect(queryByText('Average wait time: 10 minutes')).toBeNull()
  })
})
