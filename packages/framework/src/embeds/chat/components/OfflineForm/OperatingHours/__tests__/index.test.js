import React from 'react'
import userEvent from '@testing-library/user-event'
import { render } from 'src/util/testHelpers'

import OperatingHours from '../'

const renderComponent = (props = {}) => {
  const defaultProps = {
    onClick: jest.fn(),
  }

  return render(<OperatingHours {...defaultProps} {...props} />)
}

describe('OperatingHours', () => {
  it('matches snapshot', () => {
    const { container } = renderComponent()

    expect(container).toMatchInlineSnapshot(`
      .c1 {
        display: inline;
        -webkit-transition: border-color 0.25s ease-in-out, box-shadow 0.1s ease-in-out, background-color 0.25s ease-in-out, color 0.25s ease-in-out;
        transition: border-color 0.25s ease-in-out, box-shadow 0.1s ease-in-out, background-color 0.25s ease-in-out, color 0.25s ease-in-out;
        margin: 0;
        border: none;
        border-radius: 0;
        cursor: pointer;
        overflow: hidden;
        -webkit-text-decoration: none;
        text-decoration: none;
        text-overflow: ellipsis;
        font-family: inherit;
        font-weight: inherit;
        -webkit-font-smoothing: subpixel-antialiased;
        box-sizing: border-box;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-touch-callout: none;
        padding: 0;
        font-size: inherit;
        background-color: transparent;
        color: #1f73b7;
      }

      .c1::-moz-focus-inner {
        border: 0;
        padding: 0;
      }

      .c1:hover {
        -webkit-text-decoration: underline;
        text-decoration: underline;
      }

      .c1:focus {
        outline: none;
      }

      .c1[data-garden-focus-visible] {
        -webkit-text-decoration: underline;
        text-decoration: underline;
      }

      .c1:active,
      .c1[aria-pressed='true'],
      .c1[aria-pressed='mixed'] {
        -webkit-transition: border-color 0.1s ease-in-out, background-color 0.1s ease-in-out, color 0.1s ease-in-out;
        transition: border-color 0.1s ease-in-out, background-color 0.1s ease-in-out, color 0.1s ease-in-out;
        -webkit-text-decoration: underline;
        text-decoration: underline;
      }

      .c1:hover {
        color: #144a75;
      }

      .c1:active,
      .c1[aria-pressed='true'],
      .c1[aria-pressed='mixed'] {
        color: #0f3554;
      }

      .c1:disabled {
        color: #5293c7;
      }

      .c1:disabled {
        cursor: default;
        -webkit-text-decoration: none;
        text-decoration: none;
      }

      .c1 .c3 {
        width: 16px;
        min-width: 16px;
        height: 16px;
        vertical-align: middle;
      }

      .c2 .c1 {
        position: relative;
        margin-left: -1px;
      }

      .c2 .c1:hover,
      .c2 .c1:active {
        z-index: 1;
      }

      .c2 .c1:disabled {
        z-index: -1;
        border-top-width: 0;
        border-bottom-width: 0;
        border-right-color: #fff;
        border-left-color: #fff;
      }

      .c2 .c1:first-of-type:not(:last-of-type) {
        margin-left: 0;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }

      .c2 .c1:last-of-type:not(:first-of-type) {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }

      .c2 .c1:not(:first-of-type):not(:last-of-type) {
        border-radius: 0;
      }

      .c0.c0.c0 {
        color: #2f3941 !important;
        cursor: pointer;
        -webkit-text-decoration: underline !important;
        text-decoration: underline !important;
        display: block !important;
        line-height: 1em !important;
        height: auto !important;
        margin-bottom: 0.6428571428571429rem;
      }

      .c0.c0.c0:hover {
        -webkit-text-decoration: none !important;
        text-decoration: none !important;
      }

      <div>
        <div>
          <button
            class="c0 c1"
            data-garden-id="buttons.button"
            data-garden-version="8.13.0"
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
