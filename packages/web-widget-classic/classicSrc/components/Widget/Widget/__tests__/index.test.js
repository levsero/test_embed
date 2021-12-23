import { Widget } from 'classicSrc/components/Widget'
import { render } from 'classicSrc/util/testHelpers'

const renderWidgetContainer = (inProps) => {
  const defaultProps = {}

  const props = {
    ...defaultProps,
    ...inProps,
  }

  return render(<Widget {...props}>web widget content</Widget>)
}

describe('Widget', () => {
  it('matches snapshot', () => {
    const { container } = renderWidgetContainer()

    expect(container).toMatchSnapshot()
  })
})
