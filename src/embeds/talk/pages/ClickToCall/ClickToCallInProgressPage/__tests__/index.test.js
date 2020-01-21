import React from 'react'
import { fireEvent } from '@testing-library/react'
import { snapcallAPI } from 'snapcall'

import { render } from 'src/util/testHelpers'

import { TEST_IDS } from 'src/embeds/talk/constants'

import ClickToCallInProgressPage from '../'

jest.mock('src/embeds/talk/hooks/useSnapcallUpdateTime', () => () => '00:00')

const renderComponent = () => render(<ClickToCallInProgressPage />)

describe('render', () => {
  it('renders the expected title', () => {
    const { getByText } = renderComponent()

    expect(getByText('Call Us')).toBeInTheDocument()
  })

  it('renders the avatar', () => {
    const { getByTestId } = renderComponent()

    expect(getByTestId(TEST_IDS.ICON_AVATAR)).toBeInTheDocument()
  })

  it('renders the current call time', () => {
    const { getByText } = renderComponent()

    expect(getByText('00:00')).toBeInTheDocument()
  })

  it('renders the hang up button', () => {
    const { getByTestId } = renderComponent()

    expect(getByTestId(TEST_IDS.BUTTON_HANG_UP)).toBeInTheDocument()
  })

  it('calls snapcallCallEnded on Hang Up button click', () => {
    const { getByText } = renderComponent()

    fireEvent.click(getByText('Hang up'))

    expect(snapcallAPI.endCall).toHaveBeenCalled()
  })
})
