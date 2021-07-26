import { waitFor, waitForElementToBeRemoved, screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import superagent from 'superagent'
import { Device } from 'twilio-client'
import Talk from 'src/embeds/talk'
import { microphoneErrorCode } from 'src/embeds/talk/hooks/useTwilioDevice'
import { OPT_IN, OPT_OUT } from 'src/embeds/talk/reducers/recording-consent'
import createStore from 'src/redux/createStore'
import { handleTalkVendorLoaded } from 'src/redux/modules/talk'
import { updateTalkAgentAvailability } from 'src/redux/modules/talk/talk-actions'
import { render, dispatchUpdateEmbeddableConfig } from 'src/util/testHelpers'

jest.useFakeTimers()

// loads mock from framework/__mocks__/twilio-client.js
jest.mock('twilio-client')
jest.mock('superagent')

const mockResponse = {
  post: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
  body: {
    token: 'mock-twilio-token-from-talk-admin',
  },
}

const microphonePermissionDescription =
  "Call us directly from your browser. You'll need to allow microphone access when prompted."

describe('Embedded Voice scenarios', () => {
  beforeEach(() => {
    Device.mockClear()
    Device.__resetMocks()
    superagent.post = jest.fn().mockReturnValue(mockResponse)
  })

  const embeddedVoiceTalkConfig = {
    agentAvailability: true,
    capability: '3',
    enabled: true,
    nickname: 'talkNickname',
    recordingConsent: null,
  }

  const renderComponent = ({ talkConfig = {} } = {}) => {
    const store = createStore()

    store.dispatch(handleTalkVendorLoaded())
    dispatchUpdateEmbeddableConfig(store, {
      ...embeddedVoiceTalkConfig,
      ...talkConfig,
    })
    return render(<Talk />, { store })
  }

  it('initial test renders a loading spinner when Embedded Voice is first loaded', async () => {
    const { queryByRole } = renderComponent()

    expect(queryByRole('progressbar')).toBeInTheDocument()
    jest.advanceTimersByTime(3000)
    await waitForElementToBeRemoved(() => queryByRole('progressbar'))
  })

  const expectStartAndStopCallToWork = async ({ getByLabelText, getByText, queryByText }) => {
    userEvent.click(getByLabelText('Start call'))
    await waitFor(() => expect(getByText('Call in progress')).toBeInTheDocument())

    userEvent.click(getByLabelText('End call'))
    jest.advanceTimersByTime(1000)
    await waitFor(() => expect(getByText('Call ended')).toBeInTheDocument())
    jest.advanceTimersByTime(3000)

    expect(queryByText('Call us')).toBeInTheDocument()
    expect(queryByText(microphonePermissionDescription)).toBeInTheDocument()
  }

  describe('when recordingConsent is null', () => {
    const talkConfig = {
      recordingConsent: null,
    }
    it('renders the "Start call" button on the Allow microphone page', async () => {
      const { queryByText, getByLabelText } = renderComponent({ talkConfig })

      expect(queryByText('Call us')).toBeInTheDocument()
      expect(queryByText(microphonePermissionDescription)).toBeInTheDocument()
      expect(getByLabelText('Start call')).toBeInTheDocument()
    })

    it('can start and stop a call without the consent page', async () => {
      const { getByText, getByLabelText, queryByText } = renderComponent({ talkConfig })

      await expectStartAndStopCallToWork({ getByText, getByLabelText, queryByText })
      expect(getByLabelText('Start call')).toBeInTheDocument()
    })

    it('can handle errors when they occur during a call', async () => {
      const { getByText, getByLabelText, queryByText } = renderComponent({ talkConfig })

      userEvent.click(getByLabelText('Start call'))
      await waitFor(() => expect(getByText('Call in progress')).toBeInTheDocument())

      Device.__triggerError(new Error('Something went kaboom'))
      await waitFor(() => expect(getByText('Call failed')).toBeInTheDocument())
      jest.advanceTimersByTime(4000)

      expect(getByText("Call couldn't be connected")).toBeInTheDocument()

      userEvent.click(getByText('Try again'))

      expect(queryByText('Call us')).toBeInTheDocument()
      expect(queryByText(microphonePermissionDescription)).toBeInTheDocument()
      expect(getByLabelText('Start call')).toBeInTheDocument()
    })

    it('swaps to the Microphone Permissions Denied page when the microphone permissions have been denied', async () => {
      renderComponent({ talkConfig })

      userEvent.click(screen.getByLabelText('Start call'))
      await waitFor(() => expect(screen.getByText('Call in progress')).toBeInTheDocument())
      const error = new Error('Microphone permissions denied')
      error.code = microphoneErrorCode

      Device.__triggerError(error)

      await waitFor(() => expect(screen.getByText('Microphone access needed')).toBeInTheDocument())
      await waitFor(() =>
        expect(
          screen.getByText(
            'This permission may have been denied. Check browser settings to grant this permission.'
          )
        ).toBeInTheDocument()
      )
    })

    it('returns to the callInProgressPage when "Try again" is pressed in the Permissions Denied Page', async () => {
      renderComponent({ talkConfig })

      userEvent.click(screen.getByLabelText('Start call'))
      await waitFor(() => expect(screen.getByText('Call in progress')).toBeInTheDocument())
      const error = new Error('Microphone permissions denied')
      error.code = microphoneErrorCode

      Device.__triggerError(error)

      await waitFor(() => expect(screen.getByText('Microphone access needed')).toBeInTheDocument())

      userEvent.click(screen.getByText('Try again'))
      await waitFor(() => expect(screen.getByText('Call in progress')).toBeInTheDocument())
    })

    it('does not drop the call when agents go offline while a call is in progress', async () => {
      const { getByText, getByLabelText, queryByText, store } = renderComponent({
        talkConfig,
      })

      userEvent.click(getByLabelText('Start call'))
      await waitFor(() => expect(getByText('Call in progress')).toBeInTheDocument())

      store.dispatch(updateTalkAgentAvailability({ agentAvailability: false }))

      jest.advanceTimersByTime(1000)
      expect(queryByText('Call in progress')).toBeInTheDocument()
    })

    it('displays agents offline when agents go offline and a call is not in progress', async () => {
      const { queryByText, store } = renderComponent({ talkConfig })

      expect(queryByText('Call us')).toBeInTheDocument()
      expect(queryByText(microphonePermissionDescription)).toBeInTheDocument()

      store.dispatch(updateTalkAgentAvailability({ agentAvailability: false }))
      jest.advanceTimersByTime(1000)

      expect(queryByText('Call us')).toBeInTheDocument()
      expect(queryByText('All agents are currently offline. Try again later.')).toBeInTheDocument()
    })
  })

  describe('when recordingConsent is "opt-in"', () => {
    const talkConfig = {
      recordingConsent: OPT_IN,
    }
    it('renders the "Next" button on the Allow microphone page', () => {
      const { queryByText, getByText } = renderComponent({ talkConfig })

      expect(queryByText('Call us')).toBeInTheDocument()
      expect(queryByText(microphonePermissionDescription)).toBeInTheDocument()
      expect(getByText('Next')).toBeInTheDocument() // Next button probably needs a translated aria-label
    })

    it('can start and stop a call after visiting the consent page - consent is unselected by default', async () => {
      const { getByText, getByLabelText, queryByText } = renderComponent({ talkConfig })

      userEvent.click(getByText('Next'))
      await waitFor(() => expect(queryByText('Allow call to be recorded?')).toBeInTheDocument())
      expect(getByLabelText('I consent to this call being recorded.').checked).toEqual(false)
      await expectStartAndStopCallToWork({ getByText, getByLabelText, queryByText })
      expect(getByText('Next')).toBeInTheDocument()
    })
  })

  describe('when recordingConsent is "opt-out"', () => {
    const talkConfig = {
      recordingConsent: OPT_OUT,
    }
    it('renders the "Next" button on the Allow microphone page', () => {
      const { queryByText, getByText } = renderComponent({ talkConfig })

      expect(queryByText('Call us')).toBeInTheDocument()
      expect(queryByText(microphonePermissionDescription)).toBeInTheDocument()
      expect(getByText('Next')).toBeInTheDocument() // Next button probably needs a translated aria-label
    })

    it('can start and stop a call after visiting the consent page - consent is selected by default', async () => {
      const { getByText, getByLabelText, queryByText } = renderComponent({ talkConfig })

      userEvent.click(getByText('Next'))
      await waitFor(() => expect(queryByText('Allow call to be recorded?')).toBeInTheDocument())
      expect(getByLabelText('I consent to this call being recorded.').checked).toEqual(true)
      await expectStartAndStopCallToWork({ getByText, getByLabelText, queryByText })
      expect(getByText('Next')).toBeInTheDocument()
    })
  })
})
