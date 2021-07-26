import { styleSheetSerializer } from 'jest-styled-components/serializer'
import snapshotDiff from 'snapshot-diff'
import { render } from 'src/util/testHelpers'
import { Component as PhoneOnlyPage } from './../'

jest.mock('src/redux/modules/talk/talk-selectors')
jest.mock('src/util/devices')

snapshotDiff.setSerializers([...snapshotDiff.defaultSerializers, styleSheetSerializer])
expect.addSnapshotSerializer(styleSheetSerializer)

describe('PhoneOnlyPage', () => {
  const defaultProps = {
    isMobile: false,
    callUsMessage: 'Call us',
    averageWaitTime: '10',
    phoneNumber: '+61412345678',
    formattedPhoneNumber: '+61412 345 678',
    hideZendeskLogo: false,
  }

  const renderComponent = (props = {}) =>
    render(<PhoneOnlyPage {...defaultProps} {...props} />).container

  describe('on mobile', () => {
    it('renders when there is an average wait time', () => {
      expect(
        renderComponent({
          isMobile: true,
          averageWaitTime: '10',
        })
      ).toMatchSnapshot()
    })

    it('renders when there is no average wait time', () => {
      const withWaitTime = renderComponent({
        isMobile: true,
        averageWaitTime: '10',
      })

      const withoutWaitTime = renderComponent({
        isMobile: true,
        averageWaitTime: null,
      })

      expect(snapshotDiff(withWaitTime, withoutWaitTime, { contextLines: 0 })).toMatchSnapshot()
    })
  })

  describe('on desktop', () => {
    it('renders when there is an average wait time', () => {
      const mobile = renderComponent({
        isMobile: true,
        averageWaitTime: '10',
      })
      const desktop = renderComponent({
        isMobile: false,
        averageWaitTime: '10',
      })

      expect(snapshotDiff(mobile, desktop, { contextLines: 0 })).toMatchSnapshot()
    })

    it('renders when there is no average wait time', () => {
      const withWaitTime = renderComponent({
        isMobile: false,
        averageWaitTime: '10',
      })
      const withoutWaitTime = renderComponent({
        isMobile: false,
        averageWaitTime: null,
      })

      expect(snapshotDiff(withoutWaitTime, withWaitTime, { contextLines: 0 })).toMatchSnapshot()
    })
  })
})
