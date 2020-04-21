import React from 'react'
import { render } from 'src/util/testHelpers'
import { Component as PrechatForm } from '../'
import { TEST_IDS } from 'constants/shared'

jest.mock('src/embeds/chat/components/ViewHistoryButton', () => {
  return {
    __esModule: true,
    default: () => {
      return <div data-testid="history button" />
    }
  }
})

describe('PrechatForm', () => {
  const defaultProps = {
    title: 'Chat',
    prechatFormSettings: {
      message: 'Greeting message'
    }
  }

  const renderComponent = (props = {}) => render(<PrechatForm {...defaultProps} {...props} />)

  it('displays the chat title', () => {
    const { queryByText } = renderComponent({
      title: 'Some title'
    })

    expect(queryByText('Some title')).toBeInTheDocument()
  })

  it('renders the view history button', () => {
    const { queryByTestId } = renderComponent()

    expect(queryByTestId('history button')).toBeInTheDocument()
  })

  it('renders the greeting message if one exists', () => {
    const { queryByText } = renderComponent({
      prechatFormSettings: {
        message: 'Greeting message'
      }
    })

    expect(queryByText('Greeting message')).toBeInTheDocument()
  })

  it('does not render a greeting message if it does not exist', () => {
    const { queryByTestId } = renderComponent({
      prechatFormSettings: {
        message: null
      }
    })

    expect(queryByTestId(TEST_IDS.FORM_GREETING_MSG)).not.toBeInTheDocument()
  })
})
