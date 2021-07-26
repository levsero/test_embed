import { render } from 'src/util/testHelpers'
import { Component as AgentList } from '../'

const agent1 = {
  nick: 'agent:1',
  isTyping: false,
  title: 'agent1@example.com',
  display_name: 'Butch Cassidy',
}
const agent2 = {
  nick: 'agent:2',
  isTyping: false,
  title: 'agent2@example.com',
  display_name: 'The Sundance Kid',
}
const agents = {
  [agent1.nick]: agent1,
  [agent2.nick]: agent2,
}

const renderComponent = () => render(<AgentList agents={agents} />)

test('renders a list of AgentInfo components', () => {
  const { container } = renderComponent()

  expect(container).toMatchSnapshot()
})
