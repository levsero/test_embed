import { MESSAGE_STATUS } from 'src/constants'
import render from 'src/utils/test/render'
import FileMessage from '../'

const renderComponent = (props = {}) => {
  const defaultProps = {
    mediaUrl: 'http://ulti-mutt.com/pawesome-pups.pdf',
    status: 'sent',
    isPrimaryParticipant: true,
  }
  return render(<FileMessage {...defaultProps} {...props} />)
}

describe('FileMessage', () => {
  describe('for primary participant', () => {
    describe('when message status is sent', () => {
      it('renders a link with parsed filename as link text', () => {
        const { getByText } = renderComponent()

        expect(getByText('pawesome-pups.pdf')).toHaveAttribute(
          'href',
          'http://ulti-mutt.com/pawesome-pups.pdf'
        )
      })

      it('renders abbreviated link text when filename is too long', () => {
        const { getByText } = renderComponent({
          mediaUrl:
            'https://books.io/alexander%20and%20the%20terrible%20horrible%20no%20good%20very%20bad%20day.pdf',
        })

        expect(getByText('alexander a... bad day.pdf')).toBeInTheDocument()
      })

      it('renders the alt tag as the filename instead of media url as link text', () => {
        const { getByText } = renderComponent({
          altText: 'book1',
          mediaUrl: 'https://books.io/alexander-and-the-terrible-horrible-no-good-very-bad-day.pdf',
        })

        expect(getByText('book1')).toBeInTheDocument()
      })

      it('calculates and renders the size for large files in MB', () => {
        const { getByText } = renderComponent({ mediaSize: 45638473 })

        expect(getByText('45 MB')).toBeInTheDocument()
      })

      it('calculates and renders the size for small files in KB', () => {
        const { getByText } = renderComponent({ mediaSize: 274711 })

        expect(getByText('274 KB')).toBeInTheDocument()
      })

      it('calculates and renders the minimum file size for very small files', () => {
        const { getByText } = renderComponent({ mediaSize: 988 })

        expect(getByText('1 KB')).toBeInTheDocument()
      })
    })

    describe('when message is pending', () => {
      it('does not render a link to the file', () => {
        const { getByText } = renderComponent({ status: MESSAGE_STATUS.sending })

        expect(getByText('pawesome-pups.pdf')).not.toHaveAttribute(
          'href',
          'http://ulti-mutt.com/pawesome-pups.pdf'
        )
      })
    })

    describe('when message status is failed', () => {
      it('visually appears as failed', () => {
        const { getByText } = renderComponent({ status: MESSAGE_STATUS.failed })

        expect(getByText('pawesome-pups.pdf')).toHaveStyleRule('color', '#8c232c')
      })
    })
  })

  describe('for other participant', () => {
    describe('when message status is sent', () => {
      it('renders a link with a parsed long filename as link text', () => {
        const { getByText } = renderComponent({
          isPrimaryParticipant: false,
          mediaUrl:
            'https://spotify.com/?song=I%20Bet%20You%20Look%20Good%20On%20The%20Dancefloor.mp3',
        })

        expect(getByText('I Bet You L...ncefloor.mp3')).toBeInTheDocument()
      })

      it('renders a link with a parsed short filename as link text', () => {
        const { getByText } = renderComponent({
          isPrimaryParticipant: false,
          mediaUrl: 'https://spotify.com/?song=Dancing-Shoes.mp3',
        })

        expect(getByText('Dancing-Shoes.mp3')).toBeInTheDocument()
      })

      it('renders the alt tag as the filename instead of media url as link text', () => {
        const { getByText } = renderComponent({
          altText: 'A song by the Arctic Monkeys',
          mediaUrl: 'https://spotify.com/?song=Dancing-Shoes.mp3',
        })

        expect(getByText('A song by t...ctic Monkeys')).toBeInTheDocument()
      })

      it('calculates and renders the file size', () => {
        const { getByText } = renderComponent({
          isPrimaryParticipant: false,
          mediaSize: 10538473,
        })

        expect(getByText('10 MB')).toBeInTheDocument()
      })
    })
  })
})
