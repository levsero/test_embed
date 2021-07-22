import { fireEvent } from '@testing-library/react'
import _ from 'lodash'
import { render } from 'src/util/testHelpers'
import { Component as ArticlePage } from '../index'

jest.useFakeTimers()

const actions = Object.freeze({
  botFeedbackRequested: jest.fn(),
  botFeedbackMessage: jest.fn(),
  articleDismissed: jest.fn(),
  botMessage: jest.fn(),
  sessionFallback: jest.fn(),
  screenChanged: jest.fn(),
  sessionResolved: jest.fn(),
  botFallbackMessage: jest.fn(),
  originalArticleClicked: jest.fn(),
  addRestrictedImage: jest.fn(),
  performImageSearch: jest.fn(),
})

const renderComponent = (props = {}) => {
  const defaultProps = {
    article: {
      html_url: 'https://example.com',
    },
    isFeedbackRequired: false,
    locale: 'en-US',
    actions,
    storedImages: {},
    originalArticleButton: true,
  }
  const componentProps = _.merge({}, defaultProps, props)
  return render(<ArticlePage {...componentProps} />)
}
test('renders the expected title', () => {
  const { queryByText } = renderComponent({
    articleTitleKey: 'support',
  })

  expect(queryByText('Support')).toBeInTheDocument()
})

test('renders the help center article', () => {
  const { queryByText } = renderComponent({
    article: {
      id: 123,
      markedAsIrrelevant: false,
      title: 'article title is this',
      body: '<p>this is the body</p>',
    },
  })

  expect(queryByText('article title is this')).toBeInTheDocument()
  expect(queryByText('this is the body')).toBeInTheDocument()
})

test('renders the feedback popup after a certain time has passed', () => {
  const { queryByText } = renderComponent({
    isFeedbackRequired: true,
  })

  jest.runAllTimers()
  expect(queryByText('Does this article answer your question?')).toBeInTheDocument()
})

test('does not render the feedback popup if feedback is not required', () => {
  const { queryByText } = renderComponent({
    isFeedbackRequired: false,
  })

  jest.runAllTimers()
  expect(queryByText('Does this article answer your question?')).not.toBeInTheDocument()
})

describe('feedback actions', () => {
  describe('on yes click', () => {
    it('hides the feedback popup', () => {
      const { queryByText, getByText } = renderComponent({
        isFeedbackRequired: true,
      })

      jest.runAllTimers()
      fireEvent.click(getByText('Yes'))
      jest.runAllTimers()
      expect(queryByText('Yes')).not.toBeInTheDocument()
    })

    it('fires the expected actions', () => {
      const saveConversationScroll = jest.fn()
      const { getByText } = renderComponent({
        isFeedbackRequired: true,
        saveConversationScroll,
      })

      jest.runAllTimers()
      fireEvent.click(getByText('Yes'))
      expect(actions.botFeedbackRequested).toHaveBeenCalled()
      expect(actions.botMessage).toHaveBeenNthCalledWith(
        1,
        'embeddable_framework.answerBot.msg.yes_acknowledgement'
      )
      expect(actions.botMessage).toHaveBeenNthCalledWith(
        2,
        'embeddable_framework.answerBot.msg.prompt_again_after_yes'
      )
      expect(actions.sessionResolved).toHaveBeenCalled()
      expect(saveConversationScroll).toHaveBeenCalledWith({ scrollToBottom: true })
    })
  })

  describe('on no click', () => {
    it('asks for the reason', () => {
      const { queryByText, getByText } = renderComponent({
        isFeedbackRequired: true,
      })

      jest.runAllTimers()
      fireEvent.click(getByText('No, I need help'))
      expect(queryByText("It's related, but it didn't answer my question")).toBeInTheDocument()
      expect(queryByText("It's not related to my question")).toBeInTheDocument()
    })

    describe('on reason click', () => {
      it('dispatches the expected actions', () => {
        const saveConversationScroll = jest.fn()
        const { getByText } = renderComponent({
          isFeedbackRequired: true,
          saveConversationScroll,
        })

        jest.runAllTimers()
        fireEvent.click(getByText('No, I need help'))
        fireEvent.click(getByText("It's related, but it didn't answer my question"))
        expect(actions.botFeedbackRequested).toHaveBeenCalled()
        expect(actions.botFeedbackMessage).toHaveBeenNthCalledWith(
          1,
          'embeddable_framework.answerBot.msg.no_acknowledgement'
        )
        expect(actions.botFallbackMessage).toHaveBeenCalledWith(true)
        expect(actions.articleDismissed).toHaveBeenCalledWith(2)
        expect(actions.botMessage).not.toHaveBeenCalled()
        expect(actions.sessionFallback).toHaveBeenCalled()
        expect(saveConversationScroll).toHaveBeenCalledWith({ scrollToBottom: true })
        expect(actions.screenChanged).toHaveBeenCalledWith('conversation')
      })
    })
  })
})

describe('original article button', () => {
  it('is shown to the user', () => {
    const { queryByTitle } = renderComponent()

    expect(queryByTitle('View original article')).toBeInTheDocument()
  })

  it('links to the help enter article with answer bot auth token', () => {
    const authToken = 'token'
    const article = {
      id: 'article123',
      html_url: 'https://example.com/',
    }

    const { queryByTitle } = renderComponent({ authToken, article })
    const link = queryByTitle('View original article')

    expect(link.href).toBe('https://example.com/?auth_token=token')
  })

  it('dispatches an original article clicked action when clicked', () => {
    const originalArticleClicked = jest.fn()
    const article = {
      id: 'article123',
      html_url: 'https://example.com',
    }

    const { queryByTitle } = renderComponent({
      actions: { ...actions, originalArticleClicked },
      article,
    })
    const link = queryByTitle('View original article')

    link.click()

    expect(originalArticleClicked).toHaveBeenCalledWith('article123')
  })
})

describe('original article button', () => {
  it('renders when originalArticleButton is true', () => {
    const { getByTestId } = renderComponent({ originalArticleButton: true })

    expect(getByTestId('Icon--link-external')).toBeInTheDocument()
  })

  it('does not render when originalArticleButton is false', () => {
    const { queryByTestId } = renderComponent({ originalArticleButton: false })

    expect(queryByTestId('Icon--link-external')).toBeNull()
  })
})
