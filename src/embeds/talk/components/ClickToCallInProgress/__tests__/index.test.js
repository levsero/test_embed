import { snapcallAPI } from 'snapcall'
import React from 'react'
import { fireEvent } from '@testing-library/react'

import { TEST_IDS } from 'src/embeds/talk/constants'
import { render } from 'utility/testHelpers'
import ClickToCallInProgress from '..'

jest.mock('src/redux/modules/talk/talk-selectors')

const renderComponent = props => render(<ClickToCallInProgress {...props} />)

describe('render', () => {
  it('renders the avatar', () => {
    const { getByTestId } = renderComponent({ callDuration: '0:00' })

    expect(getByTestId(TEST_IDS.ICON_AVATAR)).toBeInTheDocument()
  })

  it('renders the current call time', () => {
    const { getByText } = renderComponent({ callDuration: '0:00' })

    expect(getByText('0:00')).toBeInTheDocument()
  })

  it('renders the hang up button', () => {
    const { getByTestId } = renderComponent({ callDuration: '0:00' })

    expect(getByTestId(TEST_IDS.BUTTON_HANG_UP)).toBeInTheDocument()
  })

  it('calls snapcallCallEnded on hang up button click', () => {
    const { getByText } = renderComponent({ callDuration: '0:00' })

    fireEvent.click(getByText('Hang up'))

    expect(snapcallAPI.endCall).toHaveBeenCalled()
  })
})
