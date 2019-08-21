jest.mock('src/redux/modules/talk/talk-selectors')
jest.mock('utility/devices')

import React from 'react'
import { Provider } from 'react-redux'
import { render } from '@testing-library/react'
import snapshotDiff from 'snapshot-diff'

import createStore from 'src/redux/createStore'
import { Component as PhoneOnlyPage } from './../'
import 'jest-styled-components'

describe('PhoneOnlyPage', () => {
  const defaultProps = {
    isMobile: false,
    callUsMessage: 'Call us',
    averageWaitTime: '10',
    phoneNumber: '+61412345678',
    formattedPhoneNumber: '+61412 345 678',
    title: 'Phone only page',
    hideZendeskLogo: false
  }

  const renderComponent = (props = {}) =>
    render(
      <Provider store={createStore()}>
        <PhoneOnlyPage {...defaultProps} {...props} />
      </Provider>
    ).container

  describe('on mobile', () => {
    it('renders when there is an average wait time', () => {
      expect(
        renderComponent({
          isMobile: true,
          averageWaitTime: '10'
        })
      ).toMatchSnapshot()
    })

    it('renders when there is no average wait time', () => {
      const withWaitTime = renderComponent({
        isMobile: true,
        averageWaitTime: '10'
      })

      const withoutWaitTime = renderComponent({
        isMobile: true,
        averageWaitTime: null
      })

      expect(snapshotDiff(withWaitTime, withoutWaitTime, { contextLines: 0 })).toMatchSnapshot()
    })
  })

  describe('on desktop', () => {
    it('renders when there is an average wait time', () => {
      const mobile = renderComponent({
        isMobile: true,
        averageWaitTime: '10'
      })
      const desktop = renderComponent({
        isMobile: false,
        averageWaitTime: '10'
      })

      expect(snapshotDiff(mobile, desktop, { contextLines: 0 })).toMatchSnapshot()
    })

    it('renders when there is no average wait time', () => {
      const withWaitTime = renderComponent({
        isMobile: false,
        averageWaitTime: '10'
      })
      const withoutWaitTime = renderComponent({
        isMobile: false,
        averageWaitTime: null
      })

      expect(snapshotDiff(withWaitTime, withoutWaitTime, { contextLines: 0 })).toMatchSnapshot()
    })
  })
})
