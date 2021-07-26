import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import * as talkActions from 'src/embeds/talk/actions'
import * as talkSelectors from 'src/embeds/talk/selectors'
import { render } from 'src/util/testHelpers'
import EmbeddedVoiceCallInProgressPage from '..'

const renderComponent = (props) => {
  const defaultProps = {
    callDuration: '0:00',
    onEndCallClicked: jest.fn(),
    isCallInProgress: true,
    hasLastCallFailed: false,
  }

  return render(<EmbeddedVoiceCallInProgressPage {...defaultProps} {...props} />)
}

describe('render', () => {
  it('renders the end call button', () => {
    renderComponent({ isCallInProgress: true })

    expect(screen.getByLabelText('End call')).toBeInTheDocument()
  })

  it('renders the Call in progress label', () => {
    renderComponent()

    expect(screen.getByText('Call in progress')).toBeInTheDocument()
  })

  it('renders the mute microphone button', () => {
    renderComponent({ isCallInProgress: true })

    expect(screen.getByLabelText('Mute microphone')).toBeInTheDocument()
  })

  it('renders Call failed', () => {
    renderComponent({ isCallInProgress: false, hasLastCallFailed: true })

    expect(screen.getByText('Call failed')).toBeInTheDocument()
  })

  it('renders Call ended', () => {
    renderComponent({ isCallInProgress: false, hasLastCallFailed: false })

    expect(screen.getByText('Call ended')).toBeInTheDocument()
  })

  describe('on mute button click', () => {
    it('mutes the microphone if unmuted', () => {
      jest.spyOn(talkSelectors, 'getMicrophoneMuted').mockReturnValue(false)
      jest.spyOn(talkActions, 'muteMicrophone')
      renderComponent()

      userEvent.click(screen.getByLabelText('Mute microphone'))

      expect(talkActions.muteMicrophone).toHaveBeenCalled()
    })

    it('unmutes the microphone if muted', () => {
      jest.spyOn(talkSelectors, 'getMicrophoneMuted').mockReturnValue(true)
      jest.spyOn(talkActions, 'unmuteMicrophone')
      renderComponent()

      userEvent.click(screen.getByLabelText('Mute microphone'))

      expect(talkActions.unmuteMicrophone).toHaveBeenCalled()
    })

    it('does not toggle the microphone if isCallInProgress is false', () => {
      jest.spyOn(talkSelectors, 'getMicrophoneMuted').mockReturnValue(true)
      jest.spyOn(talkActions, 'unmuteMicrophone')
      renderComponent({ isCallInProgress: false })

      userEvent.click(screen.getByLabelText('Mute microphone'))

      expect(talkActions.unmuteMicrophone).not.toHaveBeenCalled()
    })
  })

  describe('on end call click', () => {
    it('ends the call', () => {
      const onEndCallClicked = jest.fn()
      renderComponent({ onEndCallClicked })

      userEvent.click(screen.getByLabelText('End call'))

      expect(onEndCallClicked).toHaveBeenCalled()
    })

    it('does not end the call when isCallInProgress is false', () => {
      const onEndCallClicked = jest.fn()
      renderComponent({ onEndCallClicked, isCallInProgress: false })

      userEvent.click(screen.getByLabelText('End call'))

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
