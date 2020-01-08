import React from 'react'
import { render } from 'utility/testHelpers'
import FallbackField from '../'

describe('FallbackField', () => {
  const defaultProps = {}

  const renderComponent = (props = {}) => render(<FallbackField {...defaultProps} {...props} />)

  it('does not render anything', () => {
    const { container } = renderComponent()

    expect(container.firstChild).toBeNull()
  })
})
