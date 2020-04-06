import React from 'react'

import ZendeskLogo from '..'
import { render } from 'src/util/testHelpers'

test('renders logo', () => {
  const { container } = render(<ZendeskLogo />)

  expect(container.firstChild).toMatchSnapshot()
})

test('links to Zendesk Embeddables', () => {
  const { container } = render(<ZendeskLogo />)
  const link = container.querySelector('a')

  expect(link.getAttribute('href')).toContain('https://www.zendesk.com/embeddables')
})
