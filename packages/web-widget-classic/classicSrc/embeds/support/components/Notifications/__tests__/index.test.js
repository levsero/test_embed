import { render } from 'classicSrc/util/testHelpers'
import 'jest-styled-components'
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
