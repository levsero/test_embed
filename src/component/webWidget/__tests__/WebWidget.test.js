import React from 'react'
import { wait } from '@testing-library/react'

import { Component as WebWidget } from '../WebWidget'
import { render } from 'src/util/testHelpers'

let originalError

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

it('show new support embed', async () => {
  const { queryByText } = render(
    <WebWidget
      submitTicketAvailable={true}
      activeEmbed="ticketSubmissionForm"
      webWidgetReactRouterSupport={true}
    />
  )

  await wait(() => {
    expect(queryByText('I AM NEW SUPPORT')).toBeInTheDocument()
  })
})

it('show old support embed', () => {
  const { queryByText } = render(
    <WebWidget
      submitTicketAvailable={true}
      activeEmbed="ticketSubmissionForm"
      webWidgetReactRouterSupport={false}
    />
  )

  expect(queryByText('I AM NEW SUPPORT')).not.toBeInTheDocument()
  expect(queryByText('Leave us a message')).toBeInTheDocument()
})
