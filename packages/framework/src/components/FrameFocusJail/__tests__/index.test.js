import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { Component as FrameFocusJail } from '../'
import { KEY_CODES } from '@zendeskgarden/react-selection'
import { ThemeProvider } from '@zendeskgarden/react-theming'
import * as globals from 'utility/globals'

describe('FrameFocusJail', () => {
  const defaultProps = {
    name: 'webWidget',
    handleEscapeKeyPressed: jest.fn(),
    children: <div data-testid="test">children</div>,
  }

  const renderComponent = (props = {}) =>
    render(
      <ThemeProvider>
        <FrameFocusJail {...defaultProps} {...props} />
      </ThemeProvider>
    )

  it('does not handle focus when launcher is rendered', () => {
    const focusLauncher = jest.spyOn(globals, 'focusLauncher')
    const { queryByTestId } = renderComponent({ name: 'launcher' })

    fireEvent.keyDown(queryByTestId('test'), { key: 'Escape', keyCode: KEY_CODES.ESCAPE })

    expect(focusLauncher).not.toHaveBeenCalled()
  })

  describe('when web widget is closed via the escape key', () => {
    it('focuses the launcher when widget is closed via the escape key', () => {
      const focusLauncher = jest.spyOn(globals, 'focusLauncher')
      const { queryByTestId } = renderComponent()

      fireEvent.keyDown(queryByTestId('test'), { key: 'Escape', keyCode: KEY_CODES.ESCAPE })

      expect(focusLauncher).toHaveBeenCalled()
    })

    it('calls prop "handleEscapeKeyPressed"', () => {
      const handleEscapeKeyPressed = jest.fn()
      const { queryByTestId } = renderComponent({ handleEscapeKeyPressed })

      fireEvent.keyDown(queryByTestId('test'), { key: 'Escape', keyCode: KEY_CODES.ESCAPE })

      expect(handleEscapeKeyPressed).toHaveBeenCalled()
    })
  })
})
