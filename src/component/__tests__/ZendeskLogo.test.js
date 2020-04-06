import { render } from '@testing-library/react'
import React from 'react'

import { ZendeskLogo } from '../ZendeskLogo'

test('renders the expected classes', () => {
  const { container } = render(<ZendeskLogo />)

  expect(container).toMatchSnapshot()
})

test('it links to Zendesk Embeddables', () => {
  const { container } = render(<ZendeskLogo />)
  const link = container.querySelector('a')

  expect(link.getAttribute('href')).toContain('https://www.zendesk.com/embeddables')
})

test('does not have the positional classnames when mobile browser is true', () => {
  const { container } = render(<ZendeskLogo fullscreen={true} />)

  expect(container).toMatchSnapshot()
})

test('has the positional classnames for mobile browser and formSuccess is true', () => {
  const { container } = render(<ZendeskLogo formSuccess={true} fullscreen={true} />)

  expect(container).toMatchSnapshot()
})

test('does not has the rtl classnames when rtl language is false', () => {
  const { container } = render(<ZendeskLogo formSuccess={true} rtl={false} />)

  expect(container).toMatchSnapshot()
})

test('has the rtl classnames when rtl language is true', () => {
  const { container } = render(<ZendeskLogo formSuccess={true} rtl={true} />)

  expect(container).toMatchSnapshot()
})

test('has the correct logo when chat is true', () => {
  const { container } = render(<ZendeskLogo logoLink="chat" chatId="123abc" />)

  expect(container).toMatchSnapshot()
})
