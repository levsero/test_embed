import _ from 'lodash'
import { fireEvent } from '@testing-library/react'
import React from 'react'

import { http } from 'service/transport'

import { Component as ArticleScreen } from '../index'
import { render } from 'src/util/testHelpers'

http.init({
  zendeskHost: 'a.zendesk.com'
})

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
  performImageSearch: jest.fn()
})

const renderComponent = (props = {}) => {
  const defaultProps = {
    article: {
      html_url: 'https://example.com'
    },
    isFeedbackRequired: false,
    locale: 'en-US',
    actions,
    storedImages: {}
  }
  const componentProps = _.merge({}, defaultProps, props)
  return render(<ArticleScreen {...componentProps} />)
}

test('renders the expected classes', () => {
  const { container } = renderComponent()

  expect(container).toMatchSnapshot()
})

test('renders the expected mobile classes', () => {
  const { container } = renderComponent({
    isMobile: true
  })

  expect(container).toMatchSnapshot()
})

test('renders the expected title', () => {
  const { container } = renderComponent({
    articleTitleKey: 'support'
  })

  expect(container).toMatchSnapshot()
})

test('passing of scroll container classes', () => {
  const { container } = renderComponent({
    scrollContainerClasses: 'this is a class'
  })

  expect(container).toMatchSnapshot()
})

test('renders the help center article', () => {
  const { container } = renderComponent({
    article: {
      id: 123,
      markedAsIrrelevant: false,
      title: 'title',
      body: '<p>body</p>'
    }
  })

  expect(container).toMatchSnapshot()
})

test('renders the feedback popup after a certain time has passed', () => {
  const { container } = renderComponent({
    isFeedbackRequired: true
  })

  jest.runAllTimers()
  expect(container).toMatchSnapshot()
})

test('does not render the feedback popup if feedback is not required', () => {
  const { container } = renderComponent({
    isFeedbackRequired: false
  })

  jest.runAllTimers()
  expect(container).toMatchSnapshot()
})

describe('feedback actions', () => {
  describe('on yes click', () => {
    it('hides the feedback popup', () => {
      const { container, getByText } = renderComponent({
        isFeedbackRequired: true
      })

      jest.runAllTimers()
      fireEvent.click(getByText('Yes'))
      jest.runAllTimers()
      expect(container).toMatchSnapshot()
    })

    it('fires the expected actions', () => {
      const saveConversationScroll = jest.fn()
      const { getByText } = renderComponent({
        isFeedbackRequired: true,
        saveConversationScroll
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
      const { container, getByText } = renderComponent({
        isFeedbackRequired: true
      })

      jest.runAllTimers()
      fireEvent.click(getByText('No, I need help'))
      expect(container).toMatchSnapshot()
    })

    describe('on reason click', () => {
      it('dispatches the expected actions', () => {
        const saveConversationScroll = jest.fn()
        const { getByText } = renderComponent({
          isFeedbackRequired: true,
          saveConversationScroll
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
      html_url: 'https://example.com/'
    }

    const { queryByTitle } = renderComponent({ authToken, article })
    const link = queryByTitle('View original article')

    expect(link.href).toBe('https://example.com/?auth_token=token')
  })

  it('dispatches an original article clicked action when clicked', () => {
    const originalArticleClicked = jest.fn()
    const article = {
      id: 'article123',
      html_url: 'https://example.com'
    }

    const { queryByTitle } = renderComponent({
      actions: { ...actions, originalArticleClicked },
      article
    })
    const link = queryByTitle('View original article')

    link.click()

    expect(originalArticleClicked).toHaveBeenCalledWith('article123')
  })
})
