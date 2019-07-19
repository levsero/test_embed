import { render, fireEvent } from '@testing-library/react'
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
    locale: 'en-US'
  }

  const componentProps = {
    ...defaultProps,
    ...props
  }

  return render(<Footer {...componentProps} />)
}

describe('desktop', () => {
  describe('when showGetInTouch is false', () => {
    it('renders the expected classes', () => {
      const { container } = renderComponent({
        currentMessage: 'desktop message'
      })

      expect(container).toMatchSnapshot()
    })

    it('does the expected thing on chat submit', () => {
      const questionValueChanged = jest.fn(),
        questionSubmitted = jest.fn(),
        scrollToBottom = jest.fn()

      const { container } = renderComponent({
        currentMessage: 'send this',
        questionValueChanged,
        questionSubmitted,
        scrollToBottom
      })

      fireEvent.keyDown(container.querySelector('textarea'), { key: 'Enter', keyCode: 13 })

      expect(questionValueChanged).toHaveBeenCalledWith('')
      expect(questionSubmitted).toHaveBeenCalledWith('send this')
      expect(scrollToBottom).toHaveBeenCalled()
    })
  })

  describe('when showGetInTouch is true', () => {
    it('renders the expected classes', () => {
      const { container } = renderComponent({
        currentMessage: 'desktop message',
        showGetInTouch: true
      })

      expect(container).toMatchSnapshot()
    })
  })
})

describe('mobile', () => {
  describe('when showGetInTouch is false', () => {
    it('renders the expected classes', () => {
      const { container } = renderComponent({
        isMobile: true,
        currentMessage: 'mobile message'
      })

      expect(container).toMatchSnapshot()
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
        scrollToBottom
      })

      fireEvent.click(container.querySelector('button'))

      expect(questionValueChanged).toHaveBeenCalledWith('')
      expect(questionSubmitted).toHaveBeenCalledWith('send this')
      expect(scrollToBottom).toHaveBeenCalled()
    })
  })

  describe('when showGetInTouch is true', () => {
    it('renders the expected classes', () => {
      const { container } = renderComponent({
        isMobile: true,
        currentMessage: 'mobile message',
        showGetInTouch: true
      })

      expect(container).toMatchSnapshot()
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
      botChannelChoice
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
