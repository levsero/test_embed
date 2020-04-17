import React from 'react'

import { Component as WebWidget } from '../WebWidget'
import { render } from 'src/util/testHelpers'

let originalError

const renderComponent = updatedProps => {
  const defaultProps = {
    submitTicketAvailable: true,
    activeEmbed: 'ticketSubmissionForm',
    webWidgetReactRouterSupport: true
  }

  const props = { ...defaultProps, ...updatedProps }

  return render(<WebWidget {...props} />)
}

beforeEach(() => {
  // Suppress console errors as we do not care about required props complaints
  // in the two tests below. Note that these tests will be removed after the arturo
  // is removed (i.e new support embed replaces the old support embed).
  originalError = console.error // eslint-disable-line no-console

  console.error = jest.fn() // eslint-disable-line no-console
})

afterEach(() => {
  console.error = originalError // eslint-disable-line no-console
})

it('shows the support embed', () => {
  const { queryByRole } = renderComponent()

  // The Support embed is wrapped in a Suspense page
  expect(queryByRole('progressbar')).toBeTruthy()
})
