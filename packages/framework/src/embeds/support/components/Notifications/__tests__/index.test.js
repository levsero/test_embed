import 'jest-styled-components'
import { render } from 'src/util/testHelpers'
import { Alert, Title } from '../index'

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
