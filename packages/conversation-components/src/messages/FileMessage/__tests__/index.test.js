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

      it('renders abbreviated link text when filename is too long', () => {
        const { getByText } = renderComponent({
          mediaUrl: 'https://books.io/alexander-and-the-terrible-horrible-no-good-very-bad-day.pdf',
        })

        expect(getByText('alexander-a...-bad-day.pdf')).toBeInTheDocument()
      })
    })

    describe('when message status is failed', () => {
      it('renders link text with color styles for file link', () => {
        const { getByText } = renderComponent({ status: 'failed' })

        expect(getByText('pawesome-pups.pdf')).toHaveStyleRule('color', '#8c232c')
      })
    })
  })
})
