import React from 'react'
import userEvent from '@testing-library/user-event'
import { render } from 'src/util/testHelpers'

import OperatingHours from '../'

const renderComponent = (props = {}) => {
  const defaultProps = {
    onClick: jest.fn()
  }

  return render(<OperatingHours {...defaultProps} {...props} />)
}

describe('OperatingHours', () => {
  it('matches snapshot', () => {
    const { container } = renderComponent()

    expect(container).toMatchInlineSnapshot(`
      .c0.c0.c0 {
        color: #2f3941 !important;
        cursor: pointer;
        -webkit-text-decoration: underline !important;
        text-decoration: underline !important;
        height: inherit !important;
        line-height: inherit !important;
        margin-bottom: 0.6428571428571429rem;
      }

      .c0.c0.c0:hover {
        -webkit-text-decoration: none !important;
        text-decoration: none !important;
      }

      <div>
        <div>
          <button
            class="c0 index__c-btn___3y2Qe index__c-btn--anchor___ZpkO7 "
            data-garden-container-id="containers.keyboardfocus"
            data-garden-container-version="0.4.4"
            data-garden-id="buttons.button"
            data-garden-version="7.1.10"
            tabindex="0"
            type="button"
          >
            Our Operating Hours
          </button>
        </div>
      </div>
    `)
  })

  describe('Link', () => {
    it('renders the expected text', () => {
      const { getByText } = renderComponent()

      expect(getByText('Our Operating Hours')).toBeInTheDocument()
    })

    it('fires onClick when clicked', () => {
      const onClick = jest.fn()
      const { getByText } = renderComponent({ onClick })

      userEvent.click(getByText('Our Operating Hours'))

      expect(onClick).toHaveBeenCalled()
    })
  })
})
