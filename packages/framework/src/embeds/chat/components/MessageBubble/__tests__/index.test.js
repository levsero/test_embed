import { fireEvent } from '@testing-library/react'
import { find } from 'styled-components/test-utils'
import { render } from 'utility/testHelpers'
import { OptionsList } from 'embeds/chat/components/MessageBubble/MessageOptions/styles'
import * as colorUtils from 'utility/color/styles'
import { MessageContainer } from '../styles'
import MessageBubble from '../'
import { zdColorGrey200 } from '@zendeskgarden/css-variables'

describe('MessageBubble', () => {
  const defaultProps = {
    message: 'Some message',
    translatedMessage: undefined,
    isAgent: false,
    options: [],
    onOptionSelect: jest.fn(),
  }

  const renderComponent = (props = {}, options) =>
    render(<MessageBubble {...defaultProps} {...props} />, options)

  it('displays the message', () => {
    const { getByText } = renderComponent({ message: 'Some message' })

    expect(getByText('Some message')).toBeInTheDocument()
  })

  it('render any links in the message in anchor tags', () => {
    const { container } = renderComponent({
      message: 'Text1 www.example.com Text2 www.example.com/example',
    })

    const children = container.querySelector('.Linkify').childNodes

    const [text1, link1, text2, link2] = children

    expect(text1.nodeValue).toEqual(expect.stringContaining('Text1'))
    expect(text2.nodeValue).toEqual(expect.stringContaining('Text2'))

    expect(link1).toHaveProperty('href', 'http://www.example.com/')
    expect(link2).toHaveProperty('href', 'http://www.example.com/example')
  })

  it('uses the widget theme to color messages from the user', () => {
    jest.spyOn(colorUtils, 'getWidgetColorVariables').mockReturnValueOnce({
      buttonColorStr: 'green',
      buttonTextColorStr: 'blue',
    })
    const { container } = renderComponent({ isAgent: false })

    expect(find(container, MessageContainer)).toHaveStyleRule(
      'background-color',
      'green !important'
    )
    expect(find(container, MessageContainer)).toHaveStyleRule('color', 'blue !important')
  })

  it('styles agent messages gray', () => {
    const { container } = renderComponent({ isAgent: true })

    expect(find(container, MessageContainer)).toHaveStyleRule('background-color', zdColorGrey200)
  })

  describe('when the message has a translation', () => {
    it('displays the translated message by default', () => {
      const { getByText } = renderComponent({
        message: 'original',
        translatedMessage: 'translated',
      })

      expect(getByText('translated')).toBeInTheDocument()
    })

    it('displays the original message when the "view original" button is clicked', () => {
      const { getByText } = renderComponent({
        message: 'original',
        translatedMessage: 'translated',
      })

      fireEvent.click(getByText('Show original'))

      expect(getByText('original')).toBeInTheDocument()
      expect(getByText('Show translated')).toBeInTheDocument()
    })

    it('displays the translated message when the "show translated" button is clicked', () => {
      const { getByText } = renderComponent({
        message: 'original',
        translatedMessage: 'translated',
      })

      fireEvent.click(getByText('Show original'))
      fireEvent.click(getByText('Show translated'))

      expect(getByText('translated')).toBeInTheDocument()
      expect(getByText('Show original')).toBeInTheDocument()
    })
  })

  it('displays message options when options exist for the message', () => {
    const { getByText, container } = renderComponent({
      options: ['one', 'two', 'three'],
    })

    expect(getByText('one')).toBeInTheDocument()
    expect(getByText('two')).toBeInTheDocument()
    expect(getByText('three')).toBeInTheDocument()
    expect(find(container, OptionsList)).toBeInTheDocument()
  })

  it('calls onOptionSelect when an option was selected', () => {
    const onOptionSelect = jest.fn()
    const { getByText } = renderComponent({
      options: ['one', 'two', 'three'],
      onOptionSelect,
    })

    fireEvent.click(getByText('one'))

    expect(onOptionSelect).toHaveBeenCalledWith('one')
  })
})
