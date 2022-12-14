import { TEST_IDS } from 'classicSrc/constants/shared'
import { render } from 'classicSrc/util/testHelpers'
import Text from '../index'

test('renders the expected message when not visitor', () => {
  const { getByTestId } = render(<Text isVisitor={false} message="not a visitor" />)

  expect(getByTestId(TEST_IDS.CHAT_MSG_ANSWER_BOT).textContent).toEqual('not a visitor')
})

test('renders the expected message when visitor', () => {
  const { getByTestId } = render(<Text isVisitor={true} message="a visitor" />)

  expect(getByTestId(TEST_IDS.CHAT_MSG_USER).textContent).toEqual('a visitor')
})
