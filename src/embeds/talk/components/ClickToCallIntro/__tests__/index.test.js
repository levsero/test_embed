import { snapcallAPI } from 'snapcall'
import React from 'react'
import { fireEvent } from '@testing-library/react'

import { render } from 'utility/testHelpers'
import { Component as ClickToCallInProgress } from '..'

jest.mock('src/redux/modules/talk/talk-selectors')

const defaultProps = { averageWaitTime: null }

const renderComponent = props => render(<ClickToCallInProgress {...defaultProps} {...props} />)

describe('render', () => {
  describe('when the user starts a call', () => {
    it('calls the snapcall start call function', () => {
      jest.spyOn(snapcallAPI, 'startCall')

      const { getByText } = renderComponent()

      fireEvent.click(getByText('Start call'))

      expect(snapcallAPI.startCall).toHaveBeenCalled()
    })
  })

  describe('when there is an average wait time', () => {
    it('displays the average wait time', () => {
      const { getByText } = renderComponent({ averageWaitTime: 'Average wait time: 10 minutes' })

      expect(getByText('Average wait time: 10 minutes')).toBeInTheDocument()
    })
  })

  describe('when there is no average wait time', () => {
    it('does not display the average wait time', () => {
      const { queryByText } = renderComponent({ averageWaitTime: null })

      expect(queryByText('Average wait time: 10 minutes')).toBeNull()
    })
  })
})
