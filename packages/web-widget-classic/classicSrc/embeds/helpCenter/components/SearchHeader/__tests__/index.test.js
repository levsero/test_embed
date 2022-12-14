import { render } from 'classicSrc/util/testHelpers'
import snapshotDiff from 'snapshot-diff'
import SearchHeader from '../index'

const renderComponent = (inProps) => {
  const props = {
    title: 'Search',
    isMobile: false,
    ...inProps,
  }

  return render(<SearchHeader {...props} />)
}

it('renders correctly on desktop', () => {
  const { container } = renderComponent()

  expect(container).toMatchSnapshot()
})

it('renders correctly on mobile', () => {
  const { container: desktopContainer } = renderComponent()

  const { container: mobileContainer } = renderComponent({ isMobile: true })

  expect(snapshotDiff(desktopContainer, mobileContainer, { contextLines: 2 })).toMatchSnapshot()
})
