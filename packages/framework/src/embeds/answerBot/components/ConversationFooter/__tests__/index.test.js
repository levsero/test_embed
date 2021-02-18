import { fireEvent } from '@testing-library/react'
import { render } from 'utility/testHelpers'
import React from 'react'

import { Component as Footer } from '../index'

const renderComponent = (props = {}) => {
  const defaultProps = {
    currentMessage: 'string',
    questionValueChanged: noop,
    questionSubmitted: noop,
    getInTouchClicked: noop,
    botUserMessage: noop,
    botChannelChoice: noop,
    showGetInTouch: false,
    locale: 'en-US',
  }

  const componentProps = {
    ...defaultProps,
    ...props,
  }

  return render(<Footer {...componentProps} />)
}

describe('desktop', () => {
  describe('when showGetInTouch is false', () => {
    it('renders the expected elements', () => {
      const { queryByPlaceholderText, queryByText } = renderComponent({
        currentMessage: 'desktop message',
      })

      expect(queryByPlaceholderText('Type your question here...').value).toEqual('desktop message')
      expect(queryByText('Get in touch')).not.toBeInTheDocument()
    })

    it('does the expected thing on chat submit', () => {
      const questionValueChanged = jest.fn(),
        questionSubmitted = jest.fn(),
        scrollToBottom = jest.fn()

      const { container } = renderComponent({
        currentMessage: 'send this',
        questionValueChanged,
        questionSubmitted,
        scrollToBottom,
      })

      fireEvent.keyDown(container.querySelector('textarea'), { key: 'Enter', keyCode: 13 })

      expect(questionValueChanged).toHaveBeenCalledWith('')
      expect(questionSubmitted).toHaveBeenCalledWith('send this')
      expect(scrollToBottom).toHaveBeenCalled()
    })
  })

  describe('when showGetInTouch is true', () => {
    it('renders the expected elements', () => {
      const { queryByPlaceholderText, queryByText } = renderComponent({
        currentMessage: 'desktop message',
        showGetInTouch: true,
      })

      expect(queryByPlaceholderText('Type your question here...').value).toEqual('desktop message')
      expect(queryByText('Get in touch')).toBeInTheDocument()
    })
  })
})

describe('mobile', () => {
  describe('when showGetInTouch is false', () => {
    it('renders the expected elements', () => {
      const { queryByPlaceholderText, queryByText } = renderComponent({
        isMobile: true,
        currentMessage: 'mobile message',
      })

      const input = queryByPlaceholderText('Type your question here...')
      expect(input.value).toEqual('mobile message')
      expect(input.rows).toEqual(1)
      expect(queryByText('Get in touch')).not.toBeInTheDocument()
    })

    it('does the expected thing on chat submit', () => {
      const questionValueChanged = jest.fn(),
        questionSubmitted = jest.fn(),
        scrollToBottom = jest.fn()

      const { container } = renderComponent({
        isMobile: true,
        currentMessage: 'send this',
        questionValueChanged,
        questionSubmitted,
        scrollToBottom,
      })

      fireEvent.click(container.querySelector('button'))

      expect(questionValueChanged).toHaveBeenCalledWith('')
      expect(questionSubmitted).toHaveBeenCalledWith('send this')
      expect(scrollToBottom).toHaveBeenCalled()
    })
  })

  describe('when showGetInTouch is true', () => {
    it('renders the expected components', () => {
      const { queryByPlaceholderText, queryByText } = renderComponent({
        isMobile: true,
        currentMessage: 'mobile message',
        showGetInTouch: true,
      })

      const input = queryByPlaceholderText('Type your question here...')
      expect(input.value).toEqual('mobile message')
      expect(input.rows).toEqual(1)
      expect(queryByText('Get in touch')).toBeInTheDocument()
    })
  })
})

describe('handleGetInTouchClicked', () => {
  it('dispatches the expected actions', () => {
    const getInTouchClicked = jest.fn(),
      botUserMessage = jest.fn(),
      botChannelChoice = jest.fn()

    const { getByText } = renderComponent({
      showGetInTouch: true,
      getInTouchClicked,
      botUserMessage,
      botChannelChoice,
    })

    fireEvent.click(getByText('Get in touch'))

    expect(getInTouchClicked).toHaveBeenCalled()
    expect(botUserMessage).toHaveBeenCalledWith(
      'embeddable_framework.answerBot.button.get_in_touch'
    )
    expect(botChannelChoice).toHaveBeenCalledWith(
      'embeddable_framework.answerBot.msg.channel_choice.get_in_touch'
    )
  })
})
