import React from 'react'
import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import { render } from 'utility/testHelpers'
import EmbeddedVoiceallInProgressPage from '..'
import * as talkActions from 'src/embeds/talk/actions'
import * as talkSelectors from 'src/embeds/talk/selectors'

jest.mock('src/embeds/talk/selectors')

const renderComponent = props => {
  const defaultProps = {
    callDuration: '0:00',
    onEndCallClicked: jest.fn(),
    isCallActive: true
  }

  return render(<EmbeddedVoiceallInProgressPage {...defaultProps} {...props} />)
}

describe('render', () => {
  it('renders the end call button', () => {
    renderComponent({ callStatus: 'active' })

    expect(screen.getByLabelText('end call')).toBeInTheDocument()
  })

  it('renders the mute microphone button', () => {
    renderComponent({ callStatus: 'active' })

    expect(screen.getByLabelText('mute microphone')).toBeInTheDocument()
  })

  describe('on mute button click', () => {
    it('mutes the microphone if unmuted', () => {
      jest.spyOn(talkSelectors, 'getMicrophoneMuted').mockReturnValue(false)
      jest.spyOn(talkActions, 'muteMicrophone')
      renderComponent()

      userEvent.click(screen.getByLabelText('mute microphone'))

      expect(talkActions.muteMicrophone).toHaveBeenCalled()
    })

    it('unmutes the microphone if muted', () => {
      jest.spyOn(talkSelectors, 'getMicrophoneMuted').mockReturnValue(true)
      jest.spyOn(talkActions, 'unmuteMicrophone')
      renderComponent()

      userEvent.click(screen.getByLabelText('mute microphone'))

      expect(talkActions.unmuteMicrophone).toHaveBeenCalled()
    })

    it('does not toggle the microphone if isCallActive is false', () => {
      jest.spyOn(talkSelectors, 'getMicrophoneMuted').mockReturnValue(true)
      jest.spyOn(talkActions, 'unmuteMicrophone')
      renderComponent({ isCallActive: false })

      userEvent.click(screen.getByLabelText('mute microphone'))

      expect(talkActions.unmuteMicrophone).not.toHaveBeenCalled()
    })
  })

  describe('on end call click', () => {
    it('ends the call', () => {
      const onEndCallClicked = jest.fn()
      renderComponent({ onEndCallClicked })

      userEvent.click(screen.getByLabelText('end call'))

      expect(onEndCallClicked).toHaveBeenCalled()
    })

    it('does not end the call when isCallActive is false', () => {
      const onEndCallClicked = jest.fn()
      renderComponent({ onEndCallClicked, isCallActive: false })

      userEvent.click(screen.getByLabelText('end call'))

      expect(onEndCallClicked).not.toHaveBeenCalled()
    })
  })

  describe('timeInCall parsing', () => {
    it('renders one second accurately', () => {
      jest.spyOn(talkSelectors, 'getTimeInCall').mockReturnValue(1)
      renderComponent()

      expect(screen.getByText('00:01')).toBeInTheDocument()
    })

    it('parses multiple hours and minutes correctly', () => {
      jest.spyOn(talkSelectors, 'getTimeInCall').mockReturnValue(12601)
      renderComponent()

      expect(screen.getByText('3:30:01')).toBeInTheDocument()
    })
  })
})
