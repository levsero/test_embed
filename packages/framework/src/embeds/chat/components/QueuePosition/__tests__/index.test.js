import React from 'react'
import { styleSheetSerializer } from 'jest-styled-components/serializer'

import { render } from 'src/util/testHelpers'
import QueuePosition from '../index'

expect.addSnapshotSerializer(styleSheetSerializer)

const renderComponent = (inProps) => {
  const props = {
    queuePosition: 1,
    ...inProps,
  }

  return render(<QueuePosition {...props} />)
}

describe('render', () => {
  describe('label', () => {
    it('renders the correct message', () => {
      const { getByText } = renderComponent({ queuePosition: 1000 })

      expect(getByText('Queue position: 1000')).toBeInTheDocument()
    })
  })

  it('matches structure', () => {
    const { container } = renderComponent()

    expect(container).toMatchSnapshot()
  })
})
