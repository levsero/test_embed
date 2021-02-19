import { render } from 'utility/testHelpers'
import { Alert, Title } from '../index'
import 'jest-styled-components'

describe('Alert', () => {
  const renderComponent = (theme = {}) =>
    render(
      <Alert type="error">
        <Title>Some title</Title>
      </Alert>,
      { themeProps: theme }
    )

  it('renders a styled garden alert', () => {
    expect(renderComponent().container).toMatchSnapshot()
  })
})
