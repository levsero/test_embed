import { render } from 'src/apps/messenger/utils/testHelpers'
import { screen } from '@testing-library/dom'
import FileStructuredMessage from '../FileStructuredMessage'

describe('FileStructuredMessage', () => {
  const defaultProps = {
    message: {
      avatarUrl: 'emu.jpg',
      isFirstInGroup: true,
      isFirstMessageInAuthorGroup: true,
      isLastInGroup: true,
      isLastMessageInAuthorGroup: true,
      isPrimaryParticipant: true,
      mediaSize: 1000,
      mediaUrl:
        'https://z3ntpatullock.zendesk.com/attachments/token/abc123/?name=Ship-Information.pdf',
      name: 'The Dungeon Master',
      received: 123456,
    },
  }

  const renderComponent = (props = { message: {} }) => {
    const expectedProps = {
      message: {
        ...defaultProps.message,
        ...props.message,
      },
    }

    return render(<FileStructuredMessage {...expectedProps} />)
  }

  describe('displayed file name', () => {
    describe('when given altText', () => {
      it('renders the altText', () => {
        renderComponent({ message: { altText: 'Alt.pdf' } })

        expect(screen.getByText('Alt.pdf')).toBeInTheDocument()
      })
    })

    describe('when given no altText', () => {
      it('Shortens the mediaUrl into a legible filename as far as possible', () => {
        renderComponent()

        expect(screen.getByText('Ship-Information.pdf')).toBeInTheDocument()
      })

      it('Shortens the given filename if it is 24 characters or longer', () => {
        renderComponent({
          message: {
            mediaUrl:
              'https://z3ntpatullock.zendesk.com/attachments/token/abc123/?name=A-Really-Long-Name-That-Should-Be-Reduced.pdf',
          },
        })

        expect(screen.getByText('A-Really-Lo...-Reduced.pdf')).toBeInTheDocument()
      })
    })
  })
})
