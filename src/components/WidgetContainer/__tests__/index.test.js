import React from 'react'
import WidgetContainer from 'src/components/WidgetContainer'
import { render } from '@testing-library/react'

const renderWidgetContainer = inProps => {
  const defaultProps = {}

  const props = {
    ...defaultProps,
    ...inProps
  }

  return render(<WidgetContainer {...props}>web widget content</WidgetContainer>)
}

describe('WidgetContainer Element', () => {
  it('matches snapshot', () => {
    const { container } = renderWidgetContainer()

    expect(container).toMatchSnapshot()
  })
})
