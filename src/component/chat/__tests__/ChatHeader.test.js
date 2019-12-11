import { render } from '@testing-library/react'
import React from 'react'
import { ThemeProvider } from '@zendeskgarden/react-theming'

import { ChatHeader } from '../ChatHeader'

const renderComponent = inProps => {
  const props = {
    ...inProps
  }

  return render(
    <ThemeProvider>
      <ChatHeader {...props} />
    </ThemeProvider>
  )
}

it('renders the avatar', () => {
  const { container } = renderComponent({
    concierges: [
      {
        avatar: 'https://example.com/snake',
        display_name: 'Luke Skywalker',
        title: 'Jedi Knight'
      }
    ]
  })

  expect(container.querySelector('.Icon--avatar')).toBeInTheDocument()
})

it('renders the agent name and title', () => {
  const { queryByText, queryAllByText } = renderComponent({
    concierges: [
      {
        avatar: 'https://example.com/snake',
        display_name: 'Luke Skywalker',
        title: 'Jedi Knight'
      }
    ]
  })

  expect(queryAllByText('Jedi Knight').length).toEqual(2)
  expect(queryByText('Luke Skywalker')).toBeInTheDocument()
})

it('renders the default concierge name and title', () => {
  const { queryByText, queryAllByText } = renderComponent({
    concierges: [
      {
        avatar: 'https://example.com/snake'
      }
    ]
  })

  expect(queryByText('Live Support')).toBeInTheDocument()
  expect(queryAllByText('Customer Support').length).toEqual(2)
})

describe('showRating', () => {
  it('shows rating buttons when it is true', () => {
    const { container } = renderComponent({ showRating: true })

    expect(container.querySelector('.Icon--thumbUp')).toBeInTheDocument()
    expect(container.querySelector('.Icon--thumbDown')).toBeInTheDocument()
  })

  it('does not show rating buttons when it is false', () => {
    const { container } = renderComponent({ showRating: false })

    expect(container.querySelector('.Icon--thumbUp')).not.toBeInTheDocument()
    expect(container.querySelector('.Icon--thumbDown')).not.toBeInTheDocument()
  })
})

describe('showTitle', () => {
  it('hides the agent name and title if it is false', () => {
    const { queryByText } = renderComponent({
      showTitle: false,
      concierges: [
        {
          avatar: 'https://example.com/snake',
          display_name: 'Luke Skywalker',
          title: 'Jedi Knight'
        }
      ]
    })
    expect(queryByText('Luke Skywalker')).not.toBeInTheDocument()
    expect(queryByText('Jedi Knight')).not.toBeInTheDocument()
  })
})

describe('showAvatar', () => {
  it('does not render the avatar if it is false', () => {
    const { container } = renderComponent({
      concierges: [
        {
          avatar: 'https://example.com/snake',
          display_name: 'Luke Skywalker',
          title: 'Jedi Knight'
        }
      ],
      showAvatar: false
    })

    expect(container.querySelector('.Icon--avatar')).not.toBeInTheDocument()
  })
})

test('it renders nothing when avatar, title and rating are false', () => {
  const { container } = renderComponent({
    showAvatar: false,
    showRating: false,
    showTitle: false,
    concierges: [
      {
        avatar: 'https://example.com/snake',
        display_name: 'Luke Skywalker',
        title: 'Jedi Knight'
      }
    ]
  })

  expect(container.innerHTML).toEqual('')
})
