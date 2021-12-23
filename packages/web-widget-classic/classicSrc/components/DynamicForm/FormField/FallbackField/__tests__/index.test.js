import { render } from 'classicSrc/util/testHelpers'
import FallbackField from '../'

describe('FallbackField', () => {
  const renderComponent = () => render(<FallbackField />)

  it('does not render anything', () => {
    const { container } = renderComponent()

    expect(container.firstChild.firstChild).toBeNull()
  })
})
