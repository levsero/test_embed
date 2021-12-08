import { render } from 'classicSrc/util/testHelpers'
import Component from '..'

const handleFormOptionClick = jest.fn()
const ticketForms = [
  { id: 1, display_name: 'birds of a feather' },
  { id: 2, display_name: 'flock together' },
]
const renderComponent = (props = {}) => {
  const defaultProps = {
    ticketForms,
    handleFormOptionClick,
  }

  return render(<Component {...defaultProps} {...props} />)
}

describe('TicketFormList', () => {
  describe('when there are forms', () => {
    it('renders a list of form options', () => {
      const { queryByText } = renderComponent()

      ticketForms.forEach((form) => {
        expect(queryByText(form.display_name)).toBeInTheDocument()
      })
    })
  })

  describe('when there are no forms', () => {
    it('does not render', () => {
      const { container } = renderComponent({ ticketForms: [] })

      expect(container).toMatchSnapshot()
    })
  })
})
