import { TEST_IDS } from 'classicSrc/constants/shared'
import { render } from 'classicSrc/util/testHelpers'
import ChatLogFooter from '../'

const renderComponent = (inProps) => {
  const defaultProps = {
    agentsTyping: [],
    isMobile: true,
    hideZendeskLogo: false,
  }
  return render(<ChatLogFooter {...defaultProps} {...inProps} />)
}

describe('Agent Typing Indicator', () => {
  describe('when agents are typing', () => {
    describe('one agent', () => {
      it('renders single agent indicator', () => {
        const { queryByTestId, getByText } = renderComponent({
          agentsTyping: [{ display_name: 'bob' }],
        })

        expect(queryByTestId(TEST_IDS.ICON_ELLIPSIS)).toBeInTheDocument()
        expect(getByText('bob is typing')).toBeInTheDocument()
      })
    })

    describe('two agents', () => {
      it('renders double agent indicators', () => {
        const { queryByTestId, getByText } = renderComponent({
          agentsTyping: [{ display_name: 'bob' }, { display_name: 'jane' }],
        })

        expect(queryByTestId(TEST_IDS.ICON_ELLIPSIS)).toBeInTheDocument()
        expect(getByText('bob and jane are typing')).toBeInTheDocument()
      })
    })

    describe('three or more agents', () => {
      it('renders multiple agent indicators', () => {
        const { queryByTestId, getByText } = renderComponent({
          agentsTyping: [
            { display_name: 'bob' },
            { display_name: 'jane' },
            { display_name: 'suzie' },
          ],
        })

        expect(queryByTestId(TEST_IDS.ICON_ELLIPSIS)).toBeInTheDocument()
        expect(getByText('Multiple agents are typing')).toBeInTheDocument()
      })
    })
  })
})

describe('Zendesk Logo', () => {
  describe('golden path: isMobile is true, hideZendeskLogo is false, no agents typing', () => {
    it('renders Zendesk Logo', () => {
      const { getByTestId } = renderComponent()
      expect(getByTestId(TEST_IDS.ICON_ZENDESK)).toBeInTheDocument()
    })

    it('does not render agent typing message', () => {
      const { queryByTestId } = renderComponent()

      expect(queryByTestId(TEST_IDS.ICON_ELLIPSIS)).toBeNull()
    })
  })

  describe('failing path', () => {
    test.each([
      [false, true, [{ display_name: 'suzie' }]],
      [false, true, []],
      [false, false, []],
      [true, true, [{ display_name: 'suzie' }]],
      [true, true, []],
      [true, false, [{ display_name: 'suzie' }]],
    ])(
      'isMobile is %p, hideZendeskLogo is %p, agentsTyping is %p, expect no zendesk icon',
      (isMobile, hideZendeskLogo, agentsTyping) => {
        const { queryByTestId } = renderComponent({
          isMobile,
          hideZendeskLogo,
          agentsTyping,
        })

        expect(queryByTestId(TEST_IDS.ICON_ZENDESK)).toBeNull()
      }
    )
  })
})
