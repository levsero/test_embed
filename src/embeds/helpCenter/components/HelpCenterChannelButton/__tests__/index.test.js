import HelpCenterChannelButton from 'src/embeds/helpCenter/components/HelpCenterChannelButton'
import React from 'react'

import { render } from '@testing-library/react'

const renderComponent = props => {
  const defaultProps = {
    buttonLabel: 'defaultButtonLabel',
    isRTL: false,
    loading: false,
    onClickHandler: () => {},
    isMobile: false
  }

  const combinedProps = {
    ...defaultProps,
    ...props
  }

  return render(<HelpCenterChannelButton {...combinedProps} />)
}

describe('HelpCenterChannelButton', () => {
  let result
  describe('defaults', () => {
    beforeEach(() => {
      result = renderComponent()
    })

    it('renders a button with default label', () => {
      expect(result.getByText('defaultButtonLabel')).toBeInTheDocument()
    })
  })
})
