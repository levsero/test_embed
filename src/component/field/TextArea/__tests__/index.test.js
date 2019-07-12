import { render } from '@testing-library/react'
import React from 'react'
import snapshotDiff from 'snapshot-diff'
import { IdManager } from '@zendeskgarden/react-selection'

import TextArea from '../'

const renderComponent = (props = {}) => {
  const defaultProps = {
    label: 'this is a label',
    required: true,
    showError: false,
    description: 'description of field',
    onChange: noop,
    name: 'text'
  }
  const mergedProps = {
    ...defaultProps,
    ...props
  }

  IdManager.setIdCounter(0)
  return render(<TextArea {...mergedProps} textareaProps={mergedProps} />)
}

describe('TextArea', () => {
  describe('when required', () => {
    it('renders the expected component', () => {
      const { container } = renderComponent()

      expect(container).toMatchSnapshot()
    })
  })

  describe('when not required', () => {
    it('renders the expected component with an optional tag', () => {
      const defaultComponent = renderComponent()
      const component = renderComponent({ required: false })

      expect(snapshotDiff(defaultComponent, component, { contextLines: 0 })).toMatchSnapshot()
    })
  })

  describe('when showing error', () => {
    it('renders the expected component with an error message', () => {
      const defaultComponent = renderComponent()
      const component = renderComponent({ showError: true })

      expect(snapshotDiff(defaultComponent, component, { contextLines: 0 })).toMatchSnapshot()
    })
  })
})
