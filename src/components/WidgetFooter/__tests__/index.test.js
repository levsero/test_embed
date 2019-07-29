import React from 'react'
import { render } from '@testing-library/react'
import WidgetFooter from '../index'
import snapshotDiff from 'snapshot-diff'

const defaultProps = {
  children: <h1>Hello Fren</h1>
}

const renderComponent = modifiedProps => {
  const props = {
    ...defaultProps,
    ...modifiedProps
  }

  return render(<WidgetFooter {...props}>{props.children}</WidgetFooter>)
}

describe('Footer', () => {
  it('renders the component', () => {
    const { queryByText } = renderComponent()

    expect(queryByText('Hello Fren')).toBeInTheDocument()
  })

  it('matches default snapshot', () => {
    const { container } = renderComponent()

    expect(container).toMatchSnapshot()
  })

  describe('when scrollShadowVisible is true', () => {
    it('matches styled snapshots', () => {
      const { container: withoutScrollShadow } = renderComponent({ scrollShadowVisible: false })

      const { container: withScrollShadow } = renderComponent({ scrollShadowVisible: true })

      expect(
        snapshotDiff(withoutScrollShadow, withScrollShadow, { contextLines: 0 })
      ).toMatchSnapshot()
    })
  })
})
