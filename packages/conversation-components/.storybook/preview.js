import React from 'react'
import { rem } from 'polished'
import ThemeProvider from '../src/ThemeProvider'
import { baseFontSize } from '../src/constants'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' }
}

export const decorators = [
  Story => {
    return (
      <ThemeProvider>
        <div
          style={{
            width: rem('380px', 16),
            height: rem('700px', 16),
            border: '1px solid black',
            position: 'relative'
          }}
        >
          <Story />
        </div>
      </ThemeProvider>
    )
  }
]
