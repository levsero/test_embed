import { ChatOfflineForm } from '../ChatOfflineForm'
import { getByTestId } from '@testing-library/react'
import React from 'react'
import { OFFLINE_FORM_SCREENS } from 'constants/chat'
import { TEST_IDS } from 'src/constants/shared'
import { fireEvent } from '@testing-library/dom'
jest.mock('src/embeds/chat/pages/OperatingHoursPage', () => {
  return {
    __esModule: true,
    default: () => {
      return <div data-testid="operating hours page" />
    }
  }
})

jest.mock('src/embeds/chat/components/ViewHistoryButton', () => {
  return {
    __esModule: true,
    default: () => {
      return <div data-testid="history button" />
    }
  }
})

import { render } from 'src/util/testHelpers'

const handleOperatingHoursClickSpy = jest.fn(),
  handleOfflineFormBackSpy = jest.fn()

const renderForm = (props = {}) => {
  const defaultProps = {
    isAuthenticated: false,
    hasChatHistory: false,
    openedChatHistory: () => {},
    title: 'boop',
    chatOfflineFormChanged: () => {},
    sendOfflineMessage: () => {},
    handleOfflineFormBack: handleOfflineFormBackSpy,
    handleOperatingHoursClick: handleOperatingHoursClickSpy,
    formFields: {},
    greeting: 'hello fren',
    visitor: {},
    widgetShown: true,
    chatHistoryLabel: 'Chat History Here'
  }

  const combinedProps = {
    ...defaultProps,
    ...props
  }

  return render(<ChatOfflineForm {...combinedProps} />)
}

describe('render', () => {
  describe('renderForm', () => {
    describe('when isAuthenticated and has history', () => {
      it('renders the ViewHistoryButton', () => {
        const result = renderForm({
          isAuthenticated: true,
          hasChatHistory: true,
          offlineMessage: {
            screen: OFFLINE_FORM_SCREENS.MAIN
          },
          title: 'Hello fren'
        })

        expect(result.getByTestId('history button')).toBeInTheDocument()
      })
    })

    describe('when not authenticated', () => {
      it('does not render the ChatHistoryLink', () => {
        const result = renderForm({
          hasChatHistory: true,
          offlineMessage: {
            screen: OFFLINE_FORM_SCREENS.MAIN
          }
        })

        expect(result.queryByText('Chat History Here')).toBeNull()
      })
    })

    describe('when not when does not have history', () => {
      it('does not render the ChatHistoryLink', () => {
        const result = renderForm({
          isAuthenticated: true,
          offlineMessage: {
            screen: OFFLINE_FORM_SCREENS.MAIN
          }
        })

        expect(result.queryByText('Chat History Here')).toBeNull()
      })
    })
  })
})

describe("when offlineMessage's screen is in the main state", () => {
  const testRender = () =>
    renderForm({
      offlineMessage: { screen: OFFLINE_FORM_SCREENS.MAIN },
      title: 'My custom title',
      operatingHours: { enabled: true },
      phoneEnabled: true
    })

  it('renders offline greeting', () => {
    expect(testRender().getByText('hello fren')).toBeInTheDocument()
  })

  it('renders operating hours link', () => {
    expect(testRender().getByText('Our Operating Hours')).toBeInTheDocument()
  })

  it('calls handleOperatingHoursClick on operating hours click', () => {
    expect(handleOperatingHoursClickSpy).not.toHaveBeenCalled()
    fireEvent.click(testRender().getByText('Our Operating Hours'))

    expect(handleOperatingHoursClickSpy).toHaveBeenCalled()
  })

  it('renders phone number field', () => {
    expect(testRender().getByText('Phone Number')).toBeInTheDocument()
  })

  it('renders message field', () => {
    expect(testRender().getByText('Message')).toBeInTheDocument()
  })

  it('renders with the correct title', () => {
    expect(testRender().getByText('My custom title')).toBeInTheDocument()
  })
})

describe('loading screen', () => {
  const testRender = () =>
    renderForm({
      offlineMessage: { screen: OFFLINE_FORM_SCREENS.LOADING },
      title: 'test title'
    })

  describe('when the screen is the loading screen', () => {
    it('renders the loadingSpinner', () => {
      expect(getByTestId(testRender().container, TEST_IDS.LOADING_SPINNER)).toBeInTheDocument()
    })

    it('renders with the correct title', () => {
      expect(testRender().getByText('test title')).toBeInTheDocument()
    })
  })
})

describe('success screen', () => {
  const testComponent = () =>
    renderForm({
      offlineMessage: { screen: OFFLINE_FORM_SCREENS.SUCCESS },
      title: 'test title'
    })

  it('renders Done button', () => {
    expect(testComponent().getByText('Go Back')).toBeInTheDocument()
  })

  it('renders with the correct title', () => {
    expect(testComponent().getByText('test title')).toBeInTheDocument()
  })

  it('renders success text', () => {
    const { getByText } = testComponent()
    expect(getByText('Thanks for reaching out')).toBeInTheDocument()
    expect(getByText('Someone will get back to you soon')).toBeInTheDocument()
  })
})

describe('operating hours page', () => {
  it('renders operating hours', () => {
    const result = renderForm({
      offlineMessage: { screen: OFFLINE_FORM_SCREENS.OPERATING_HOURS },
      operatingHours: { enabled: true },
      title: 'test operating hours page'
    })

    expect(result.getByTestId('operating hours page')).toBeInTheDocument()
  })
})
