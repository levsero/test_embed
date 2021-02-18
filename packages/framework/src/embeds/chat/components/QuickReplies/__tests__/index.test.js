import React from 'react'
import { render } from 'src/util/testHelpers'
import { snapshotDiff } from 'snapshot-diff'

import { QuickReplies } from '../'

const renderComponent = (props = {}) => {
  const defaultProps = {
    isMobile: false,
  }

  return render(
    <QuickReplies {...defaultProps} {...props}>
      <h1>derp</h1>
      <h2>Derpette</h2>
    </QuickReplies>
  )
}

describe('QuickReplies', () => {
  it('matches snapshot', () => {
    const { container } = renderComponent()

    expect(container).toMatchSnapshot()
  })

  describe('when is Mobile', () => {
    it('applies isMobile to class', () => {
      const { container: desktopContainer } = renderComponent()
      const { container: mobileContainer } = renderComponent({ isMobile: true })

      expect(snapshotDiff(desktopContainer, mobileContainer, { contextLines: 1 })).toMatchSnapshot()
    })
  })
})
