import { render, fireEvent } from '@testing-library/react'
import { TEST_IDS } from 'classicSrc/constants/shared'
import { MessageBubble } from '../index'

const messageText = 'this is the original text'
const translatedText = 'this is the translated text'

describe('translated message', () => {
  describe('rerender', () => {
    test('translated message passed in but user has already clicked on link', () => {
      const component = (
        <MessageBubble message={messageText} translatedMessage={translatedText} data-testid="foo" />
      )
      const { getByText, queryByText, rerender } = render(component)

      fireEvent.click(getByText('Show original'))

      rerender(component)

      expect(queryByText(translatedText)).not.toBeInTheDocument()
      expect(getByText(messageText)).toBeInTheDocument()
    })
  })

  test('switching between original and translated text', () => {
    const { getByText, queryByText } = render(
      <MessageBubble message={messageText} translatedMessage={translatedText} data-testid="foo" />
    )

    expect(queryByText(translatedText)).toBeInTheDocument()
    expect(queryByText(messageText)).not.toBeInTheDocument()

    fireEvent.click(getByText('Show original'))

    expect(queryByText(translatedText)).not.toBeInTheDocument()
    expect(getByText(messageText)).toBeInTheDocument()

    fireEvent.click(getByText('Show translated'))

    expect(queryByText(translatedText)).toBeInTheDocument()
    expect(queryByText(messageText)).not.toBeInTheDocument()
  })
})

test('translated message not passed in', () => {
  const { queryByText, queryByTestId } = render(
    <MessageBubble message={messageText} data-testid="foo" />
  )

  expect(queryByText(translatedText)).not.toBeInTheDocument()
  expect(queryByText(messageText)).toBeInTheDocument()
  expect(queryByTestId(TEST_IDS.TRANSLATE_LINK)).not.toBeInTheDocument()
})
