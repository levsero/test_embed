import React from 'react'
import userEvent from '@testing-library/user-event'
import { waitFor } from '@testing-library/dom'
import { Device } from 'twilio-client'
import superagent from 'superagent'

import createStore from 'src/redux/createStore'
import { handleTalkVendorLoaded } from 'src/redux/modules/talk'
import { render, dispatchUpdateEmbeddableConfig } from 'src/util/testHelpers'
import { OPT_IN, OPT_OUT } from 'src/embeds/talk/reducers/recording-consent'
import EmbeddedVoicePage from '../index'

jest.useFakeTimers()

// loads mock from framework/__mocks__/twilio-client.js
jest.mock('twilio-client')
jest.mock('superagent')

const mockResponse = {
  post: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
  body: {
    token: 'mock-twilio-token-from-talk-admin'
  }
}

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
  recordingConsent: null
}

const renderComponent = ({ talkConfig = {} } = {}) => {
  const store = createStore()

  store.dispatch(handleTalkVendorLoaded())
  dispatchUpdateEmbeddableConfig(store, {
    ...embeddedVoiceTalkConfig,
    ...talkConfig
  })
  return render(<EmbeddedVoicePage />, { store })
}

const expectStartAndStopCallToWork = async ({ getByLabelText, getByText, queryByText }) => {
  userEvent.click(getByLabelText('Start Call'))
  await waitFor(() => expect(getByText('Call in progress')).toBeInTheDocument())

  userEvent.click(getByLabelText('end call'))
  jest.advanceTimersByTime(1000)
  await waitFor(() => expect(getByText('Call ended')).toBeInTheDocument())
  jest.advanceTimersByTime(3000)

  expect(queryByText('Call us')).toBeInTheDocument()
  expect(queryByText('Allow microphone')).toBeInTheDocument()
}

describe('when recordingConsent is null', () => {
  const talkConfig = {
    recordingConsent: null
  }
  it('renders the "Start Call" button on the Allow microphone page', () => {
    const { queryByText, getByLabelText } = renderComponent({ talkConfig })

    expect(queryByText('Call us')).toBeInTheDocument()
    expect(queryByText('Allow microphone')).toBeInTheDocument()
    expect(getByLabelText('Start Call')).toBeInTheDocument()
  })

  it('can start and stop a call without the consent page', async () => {
    const { getByText, getByLabelText, queryByText } = renderComponent({ talkConfig })

    await expectStartAndStopCallToWork({ getByText, getByLabelText, queryByText })
    expect(getByLabelText('Start Call')).toBeInTheDocument()
  })

  it('can handle errors when they occur during a call', async () => {
    const { getByText, getByLabelText } = renderComponent({ talkConfig })

    userEvent.click(getByLabelText('Start Call'))
    await waitFor(() => expect(getByText('Call in progress')).toBeInTheDocument())

    Device.__triggerError(new Error('Something went kaboom'))
    await waitFor(() => expect(getByText('Call ended')).toBeInTheDocument())
    jest.advanceTimersByTime(4000)

    expect(getByText("Call couldn't be connected")).toBeInTheDocument()
    expect(getByText('Reconnect')).toBeInTheDocument()
  })
})

describe('when recordingConsent is "opt-in"', () => {
  const talkConfig = {
    recordingConsent: OPT_IN
  }
  it('renders the "Next" button on the Allow microphone page', () => {
    const { queryByText, getByText } = renderComponent({ talkConfig })

    expect(queryByText('Call us')).toBeInTheDocument()
    expect(queryByText('Allow microphone')).toBeInTheDocument()
    expect(getByText('Next')).toBeInTheDocument() // Next button probably needs a translated aria-label
  })

  it('can start and stop a call after visiting the consent page - consent is unselected by default', async () => {
    const { getByText, getByLabelText, queryByText } = renderComponent({ talkConfig })

    userEvent.click(getByText('Next'))
    await waitFor(() => expect(queryByText('Allow call to be recorded?')).toBeInTheDocument())
    expect(getByLabelText('I consent to this call being recorded').checked).toEqual(false)
    await expectStartAndStopCallToWork({ getByText, getByLabelText, queryByText })
    expect(getByText('Next')).toBeInTheDocument()
  })
})

describe('when recordingConsent is "opt-out"', () => {
  const talkConfig = {
    recordingConsent: OPT_OUT
  }
  it('renders the "Next" button on the Allow microphone page', () => {
    const { queryByText, getByText } = renderComponent({ talkConfig })

    expect(queryByText('Call us')).toBeInTheDocument()
    expect(queryByText('Allow microphone')).toBeInTheDocument()
    expect(getByText('Next')).toBeInTheDocument() // Next button probably needs a translated aria-label
  })

  it('can start and stop a call after visiting the consent page - consent is selected by default', async () => {
    const { getByText, getByLabelText, queryByText } = renderComponent({ talkConfig })

    userEvent.click(getByText('Next'))
    await waitFor(() => expect(queryByText('Allow call to be recorded?')).toBeInTheDocument())
    expect(getByLabelText('I consent to this call being recorded').checked).toEqual(true)
    await expectStartAndStopCallToWork({ getByText, getByLabelText, queryByText })
    expect(getByText('Next')).toBeInTheDocument()
  })
})
