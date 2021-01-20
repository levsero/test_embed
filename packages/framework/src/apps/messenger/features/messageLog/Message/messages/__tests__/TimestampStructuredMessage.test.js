import React from 'react'
import { render } from 'src/apps/messenger/utils/testHelpers'

import TimestampStructuredMessage from '../TimestampStructuredMessage'

const renderComponent = (props = {}) => {
  const mergedProps = {
    message: {
      received: new Date('11:59 PM September 28, 2020').getTime(),
      ...props
    }
  }
  return render(<TimestampStructuredMessage {...mergedProps} />)
}

describe('TimestampStructuredMessage', () => {
  it('matches snapshot', () => {
    const { container } = renderComponent()

    expect(container).toMatchInlineSnapshot(`
      .c0 {
        width: 100%;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-direction: column;
        -ms-flex-direction: column;
        flex-direction: column;
        margin-top: 0.75rem;
      }

      .c1 {
        font-size: 0.75rem;
        line-height: 1rem;
        height: 1rem;
        -webkit-letter-spacing: 0;
        -moz-letter-spacing: 0;
        -ms-letter-spacing: 0;
        letter-spacing: 0;
        color: #68737d;
        -webkit-align-self: center;
        -ms-flex-item-align: center;
        align-self: center;
      }

      <div>
        <div>
          <div
            class="c0"
          >
            <p
              class="c1"
            >
              September 28, 11:59 PM
            </p>
          </div>
        </div>
      </div>
    `)
  })
})
