import { snapcallAPI } from 'snapcall'
import React from 'react'
import { fireEvent } from '@testing-library/react'

import { TEST_IDS } from 'src/embeds/talk/constants'
import { render } from 'utility/testHelpers'
import ClickToCallInProgress from '..'

jest.mock('src/redux/modules/talk/talk-selectors')
jest.mock('src/embeds/talk/hooks/useSnapcallUpdateTime', () => () => '00:00')

const renderComponent = () => render(<ClickToCallInProgress />)

describe('render', () => {
  it('renders the avatar', () => {
    const { getByTestId } = renderComponent()

    expect(getByTestId(TEST_IDS.ICON_AVATAR)).toBeInTheDocument()
  })

  it('renders the current call time', () => {
    const { getByText } = renderComponent()

    expect(getByText('00:00')).toBeInTheDocument()
  })

  it('renders the End call button', () => {
    const { getByTestId } = renderComponent()

    expect(getByTestId(TEST_IDS.BUTTON_HANG_UP)).toBeInTheDocument()
  })

  it('calls snapcallCallEnded on End call button click', () => {
    const { getByText } = renderComponent()

    fireEvent.click(getByText('End call'))

    expect(snapcallAPI.endCall).toHaveBeenCalled()
  })
})
