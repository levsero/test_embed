import React from 'react'
import { render } from 'utility/testHelpers'
import { AgentTyping } from '..'

describe('AgentTyping', () => {
  const defaultProps = {
    agentsTyping: []
  }

  const renderComponent = props => render(<AgentTyping {...defaultProps} {...props} />)

  it('returns an empty div if there are no agents typing', () => {
    const { container } = renderComponent()

    expect(container).toMatchSnapshot()
  })

  describe('when one agent is typing', () => {
    const agentsTyping = [{ display_name: 'Cordelia' }]

    it('renders the expected container', () => {
      const { container } = render(<AgentTyping agentsTyping={agentsTyping} />)

      expect(container).toMatchSnapshot()
    })

    it('displays the expected message', () => {
      const { getByText } = render(<AgentTyping agentsTyping={agentsTyping} />)

      getByText('Cordelia is typing')
    })
  })

  describe('when two agents are typing', () => {
    it('displays the expected message', () => {
      const agentsTyping = [
        { display_name: 'Cordelia' },
        { display_name: 'A less good dog with a long name' }
      ]
      const { getByText } = render(<AgentTyping agentsTyping={agentsTyping} />)

      getByText('Cordelia and A less good dog with a long name are typing')
    })
  })

  describe('when more than two agents are typing', () => {
    it('displays the expected message', () => {
      const agentsTyping = [
        { display_name: 'Cordelia' },
        { display_name: 'A less good dog with a long name' },
        { display_name: 'A short dog' }
      ]
      const { getByText } = render(<AgentTyping agentsTyping={agentsTyping} />)

      getByText('Multiple agents are typing')
    })
  })
})
