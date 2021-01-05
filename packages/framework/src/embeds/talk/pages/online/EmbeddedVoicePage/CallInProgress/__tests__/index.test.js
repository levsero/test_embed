import React from 'react'
import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import { render } from 'utility/testHelpers'
import EmbeddedVoiceallInProgressPage from '..'
import * as talkActions from 'src/embeds/talk/actions'
import * as talkSelectors from 'src/embeds/talk/selectors'

jest.mock('src/embeds/talk/selectors')

const defaultProps = {
  callDuration: '0:00',
  onEndCallClicked: jest.fn()
}

const renderComponent = props =>
  render(<EmbeddedVoiceallInProgressPage {...defaultProps} {...props} />)

describe('render', () => {
  it('renders the end call button', () => {
    renderComponent({ callStatus: 'active' })

    expect(screen.getByLabelText('end call')).toBeInTheDocument()
  })

  it('renders the mute microphone button', () => {
    renderComponent({ callStatus: 'active' })

    expect(screen.getByLabelText('mute microphone')).toBeInTheDocument()
  })

  it('renders the current call duration', () => {
    renderComponent({ callDuration: '12:34' })

    expect(screen.getByText('12:34')).toBeInTheDocument()
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
  })

  describe('on end call click', () => {
    it('ends the call', () => {
      const onEndCallClicked = jest.fn()
      renderComponent({ onEndCallClicked })

      userEvent.click(screen.getByLabelText('end call'))

      expect(onEndCallClicked).toHaveBeenCalled()
    })
  })
})
