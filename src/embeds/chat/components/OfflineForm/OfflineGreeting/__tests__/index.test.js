import React from 'react'
import { render } from 'src/util/testHelpers'
import { TEST_IDS } from 'src/constants/shared'

import OfflineGreeting from '../'

const renderComponent = (props = {}) => {
  const defaultProps = {
    greeting: 'hello friend!'
  }

  return render(<OfflineGreeting {...defaultProps} {...props} />)
}

describe('OfflineGreeting', () => {
  it('matches snapshot', () => {
    const { container } = renderComponent()

    expect(container).toMatchInlineSnapshot(`
      .c0 {
        margin-top: 0.35714285714285715rem !important;
        display: block;
        white-space: pre-wrap;
        margin-bottom: 0.6428571428571429rem;
      }

      <div>
        <div>
          <span
            class="c0"
          >
            <span
              data-testid="form-greeting-msg"
            >
              hello friend!
            </span>
          </span>
        </div>
      </div>
    `)
  })

  it('renders the greeting', () => {
    const { getByTestId } = renderComponent()

    expect(getByTestId(TEST_IDS.FORM_GREETING_MSG)).toHaveTextContent('hello friend!')
  })
})
