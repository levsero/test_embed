import React from 'react'
import { Provider } from 'react-redux'
import { render } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import 'jest-styled-components'

import createStore from 'src/redux/createStore'
import SuccessNotification from '../'

function renderWithThemeProvider(ui, { theme, store = createStore() } = {}) {
  return {
    ...render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>{ui}</ThemeProvider>
      </Provider>
    )
  }
}

test('renders a success notification', () => {
  const { container } = render(<SuccessNotification />)
  expect(container).toMatchSnapshot()
})

test(`"it applies a theme 'baseColor' to the success icon"`, () => {
  const { container } = renderWithThemeProvider(<SuccessNotification />, {
    theme: { baseColor: '#4400FF' }
  })
  expect(container).toMatchSnapshot()
})
