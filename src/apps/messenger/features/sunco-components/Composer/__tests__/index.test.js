import React from 'react'
import { render } from 'src/apps/messenger/utils/testHelpers'

import Composer from '../'

jest.mock('src/apps/messenger/suncoClient')

describe('Composer', () => {
  const defaultProps = {
    isEnabled: true,
    label: 'Type a message',
    maxRows: 5,
    minRows: 1,
    message: '',
    onSubmit: () => {},
    onChange: () => {}
  }

  const renderComponent = (props = {}) => {
    return render(<Composer {...defaultProps} {...props} />)
  }

  it('renders the component with a placeholder', () => {
    const { getByLabelText } = renderComponent()

    expect(getByLabelText('Type a message')).toHaveAttribute('placeholder', 'Type a message')
  })

  it('focuses on the composer on initial render', () => {
    const { getByLabelText } = renderComponent()

    expect(getByLabelText('Type a message')).toHaveFocus()
  })

  it('shows the send icon is not present before the user starts typing', () => {
    const { queryByLabelText } = renderComponent()

    expect(queryByLabelText('Send message')).not.toBeInTheDocument()
  })

  it('shows the send icon once the user starts typing', () => {
    const { getByLabelText } = renderComponent({ message: 'hello I am a user' })

    expect(getByLabelText('Send message')).toBeInTheDocument()
  })
})
