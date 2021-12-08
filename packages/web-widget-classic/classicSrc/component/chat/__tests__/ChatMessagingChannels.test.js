import { TEST_IDS } from 'classicSrc/constants/shared'
import { render } from 'classicSrc/util/testHelpers'
import { styleSheetSerializer } from 'jest-styled-components/serializer'
import snapshotDiff from 'snapshot-diff'
import { find } from 'styled-components/test-utils'
import ChatMessagingChannels from '../ChatMessagingChannels'
import { Container } from '../ChatMessagingChannelsStyles'

snapshotDiff.setSerializers([...snapshotDiff.defaultSerializers, styleSheetSerializer])
expect.addSnapshotSerializer(styleSheetSerializer)

const renderComponent = (props = {}, testProps = {}) => {
  const defaultProps = {}

  return render(<ChatMessagingChannels {...defaultProps} {...props} />, { ...testProps })
}

describe('ChatMessagingChannels', () => {
  describe('when neither messenger or twitter are allowed', () => {
    it('does not render anything', () => {
      const { container } = renderComponent({
        channels: {
          facebook: { allowed: false, page_id: '1' },
          twitter: { allowed: false, page_id: '1' },
        },
      })

      expect(find(container, Container)).toBeNull()
    })
  })
  describe('when at least one channel is available', () => {
    describe('messenger is the only channel available', () => {
      it('renders the Messenger Chan', () => {
        const { getByTestId } = renderComponent({
          channels: {
            facebook: { allowed: true, page_id: '1' },
            twitter: { allowed: false, page_id: '1' },
          },
        })

        expect(getByTestId(TEST_IDS.ICON_MESSENGER)).toBeInTheDocument()
      })
      it('does not render the Twitter Channel', () => {
        const { queryByTestId } = renderComponent({
          channels: {
            facebook: { allowed: true, page_id: '1' },
            twitter: { allowed: false, page_id: '1' },
          },
        })

        expect(queryByTestId(TEST_IDS.ICON_TWITTER)).toBeNull()
      })
    })

    describe('twitter is the only channel available', () => {
      it('renders the Twitter Channel', () => {
        const { getByTestId } = renderComponent({
          channels: {
            facebook: { allowed: false, page_id: '1' },
            twitter: { allowed: true, page_id: '1' },
          },
        })

        expect(getByTestId(TEST_IDS.ICON_TWITTER)).toBeInTheDocument()
      })
      it('does not render the Messenger Channel', () => {
        const { queryByTestId } = renderComponent({
          channels: {
            facebook: { allowed: false, page_id: '1' },
            twitter: { allowed: true, page_id: '1' },
          },
        })

        expect(queryByTestId(TEST_IDS.ICON_MESSENGER)).toBeNull()
      })
    })
  })

  describe('when both channels are available', () => {
    it('renders both channels', () => {
      const { getByTestId } = renderComponent({
        channels: {
          facebook: { allowed: true, page_id: '1' },
          twitter: { allowed: true, page_id: '1' },
        },
      })

      expect(getByTestId(TEST_IDS.ICON_TWITTER)).toBeInTheDocument()
      expect(getByTestId(TEST_IDS.ICON_MESSENGER)).toBeInTheDocument()
    })

    describe('when isMobile is true', () => {
      it('renders icons at different sizes', () => {
        const { container: desktopContainer } = renderComponent({
          channels: {
            facebook: { allowed: true, page_id: '1' },
            twitter: { allowed: true, page_id: '1' },
          },
        })
        const { container: mobileContainer } = renderComponent(
          {
            channels: {
              facebook: { allowed: true, page_id: '1' },
              twitter: { allowed: true, page_id: '1' },
            },
          },
          { widgetThemeProps: { isMobile: true } }
        )

        expect(
          snapshotDiff(desktopContainer, mobileContainer, { contextLines: 0 })
        ).toMatchSnapshot()
      })

      describe('when isRTL is true', () => {
        it('applies rtl paddings', () => {
          const { container: desktopContainer } = renderComponent(
            {
              channels: {
                facebook: { allowed: true, page_id: '1' },
                twitter: { allowed: true, page_id: '1' },
              },
            },
            {
              themeProps: { rtl: true },
            }
          )

          const { container: mobileContainer } = renderComponent(
            {
              channels: {
                facebook: { allowed: true, page_id: '1' },
                twitter: { allowed: true, page_id: '1' },
              },
            },
            {
              themeProps: { rtl: true },
              widgetThemeProps: { isMobile: true },
            }
          )

          expect(
            snapshotDiff(desktopContainer, mobileContainer, { contextLines: 0 })
          ).toMatchSnapshot()
        })
      })
    })
  })
})
