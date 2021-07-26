import { render } from 'src/util/testHelpers'
import BotTyping from '../index'

test('renders the expected elements', () => {
  const { queryByTestId } = render(<BotTyping />)

  expect(queryByTestId('Icon--ellipsis')).toBeInTheDocument()
})
