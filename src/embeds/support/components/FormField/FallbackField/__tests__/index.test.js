import React from 'react'
import { render } from 'utility/testHelpers'
import FallbackField from '../'
import logger from 'utility/logger'

jest.mock('utility/logger')

describe('FallbackField', () => {
  const defaultProps = {
    field: {
      type: 'unsupported field'
    }
  }

  const renderComponent = (props = {}) => render(<FallbackField {...defaultProps} {...props} />)

  it('logs an error when an invalid field type is provided', () => {
    renderComponent()

    expect(logger.error).toHaveBeenCalledWith(
      `Support contact form: An invalid field of type "unsupported field" was rendered`
    )
  })

  it('does not render anything', () => {
    const { container } = renderComponent()

    expect(container.firstChild).toBeNull()
  })
})
