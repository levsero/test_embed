import { render } from 'classicSrc/util/testHelpers'
import ZendeskLogo from '..'

test('renders logo', () => {
  const { container } = render(<ZendeskLogo />)

  expect(container.firstChild).toMatchSnapshot()
})

test('links to Zendesk Embeddables', () => {
  const { container } = render(<ZendeskLogo />)
  const link = container.querySelector('a')

  expect(link.getAttribute('href')).toContain('https://www.zendesk.com/embeddables')
})
