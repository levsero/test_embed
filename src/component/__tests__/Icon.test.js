import { render } from '@testing-library/react'
import React from 'react'

import { Icon } from '../Icon'

describe('Icon', () => {
  it('renders expected classes', function() {
    const { container } = render(<Icon type="Icon--zendesk" />)

    expect(container).toMatchSnapshot()
  })

  it('renders expected mobile classes when mobile is true', function() {
    const { container } = render(<Icon type="Icon--zendesk" isMobile={true} />)

    expect(container).toMatchSnapshot()
  })

  it('renders expected flipx classes when flipX is true', function() {
    const { container } = render(<Icon type="Icon--zendesk" flipX={true} />)

    expect(container).toMatchSnapshot()
  })
})
