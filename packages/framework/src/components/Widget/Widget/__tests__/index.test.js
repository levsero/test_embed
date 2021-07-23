import { Widget } from 'src/components/Widget'
import { render } from 'src/util/testHelpers'

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
