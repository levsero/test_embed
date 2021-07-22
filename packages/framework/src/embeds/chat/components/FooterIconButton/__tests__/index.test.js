import { render } from '@testing-library/react'
import { zdColorGrey600 } from '@zendeskgarden/css-variables'
import FooterIconButton from 'embeds/chat/components/FooterIconButton'
import { isMobileBrowser } from 'utility/devices'

jest.mock('utility/devices')

describe('FooterIconButton', () => {
  const defaultProps = {
    children: (
      <svg>
        <path />
      </svg>
    ),
  }

  const renderComponent = (props = {}) => render(<FooterIconButton {...defaultProps} {...props} />)

  it('renders', () => {
    isMobileBrowser.mockReturnValue(false)
    const { container } = renderComponent()

    expect(container.firstChild).toMatchSnapshot()
  })

  it("defaults to coloring the svg's stroke property when colorType is not provided", () => {
    const { container } = renderComponent()

    expect(container.querySelector('path')).toHaveStyle(`
      stroke: ${zdColorGrey600} !important;
    `)
  })

  it("colors the svg's stroke property when colorType is stroke", () => {
    const { container } = renderComponent({ colorType: 'stroke' })

    expect(container.querySelector('path')).toHaveStyle(`
      stroke: ${zdColorGrey600} !important;
    `)
  })

  it("colors the svg's fill property when colorType is fill", () => {
    const { container } = renderComponent({ colorType: 'fill' })

    expect(container.querySelector('path')).toHaveStyle(`
      fill: ${zdColorGrey600} !important;
    `)
  })
})
