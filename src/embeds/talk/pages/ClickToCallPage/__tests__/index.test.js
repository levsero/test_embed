import { snapcallAPI } from 'snapcall'
import React from 'react'
import { fireEvent } from '@testing-library/react'

import { TEST_IDS } from 'src/embeds/talk/constants'
import { render } from 'utility/testHelpers'
import { Component as ClickToCallPage } from '..'

jest.mock('src/redux/modules/talk/talk-selectors')
jest.mock('src/embeds/talk/hooks/useSnapcallUpdateTime', () => () => '00:00')

let props = {}

const renderComponent = () => render(<ClickToCallPage {...props} />)

describe('render', () => {
  it('renders the expected title', () => {
    const { getByText } = renderComponent()

    expect(getByText('Call Us')).toBeInTheDocument()
  })

  describe('when there is no call in progress', () => {
    beforeEach(() => {
      props.callStatus = null
    })
    describe('when the user starts a call', () => {
      it('calls the snapcall start call function', () => {
        jest.spyOn(snapcallAPI, 'startCall')

        const { getByText } = renderComponent()

        fireEvent.click(getByText('Start Call'))

        expect(snapcallAPI.startCall).toHaveBeenCalled()
      })
    })

    describe('when there is an average wait time', () => {
      it('displays the average wait time', () => {
        props.averageWaitTime = 'Average wait time: 10 minutes'
        const { getByText } = renderComponent()

        expect(getByText('Average wait time: 10 minutes')).toBeInTheDocument()
      })
    })

    describe('when there is no average wait time', () => {
      it('does not display the average wait time', () => {
        props.averageWaitTime = null
        const { queryByText } = renderComponent()

        expect(queryByText('Average wait time: 10 minutes')).toBeNull()
      })
    })
  })

  describe('when there is a call in progress', () => {
    beforeEach(() => {
      props.callStatus = 'active'
    })

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
})
