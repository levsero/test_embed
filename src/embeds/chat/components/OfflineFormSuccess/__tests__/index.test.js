import React from 'react'
import { fireEvent } from '@testing-library/react'
import { render } from 'src/util/testHelpers'

import OfflineFormSuccess from '../'

const renderComponent = (props = {}) => {
  const defaultProps = {
    onClick: jest.fn()
  }

  return render(<OfflineFormSuccess {...defaultProps} {...props} />)
}

describe('OfflineFormSuccess', () => {
  it('renders success text', () => {
    const { getByText } = renderComponent()

    expect(getByText('Thanks for reaching out')).toBeInTheDocument()
    expect(getByText('Someone will get back to you soon')).toBeInTheDocument()
  })

  it('renders Back button', () => {
    const { getByText } = renderComponent()

    expect(getByText('Done')).toBeInTheDocument()
  })

  it('fires onClick when back button is pressed', () => {
    const onClick = jest.fn()
    const { getByText } = renderComponent({ onClick })

    fireEvent.click(getByText('Done'))

    expect(onClick).toHaveBeenCalled()
  })
})
