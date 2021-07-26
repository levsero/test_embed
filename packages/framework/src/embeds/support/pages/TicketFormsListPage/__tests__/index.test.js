import { fireEvent } from '@testing-library/react'
import { render } from 'src/util/testHelpers'
import { Component as TicketFormsListPage } from '../index'

const renderComponent = (
  {
    handleFormOptionClick = () => {},
    selectTicketFormLabel = '',
    formTitle = '',
    ticketForms = [],
    isLoading = false,
  },
  options
) => {
  return render(
    <TicketFormsListPage
      handleFormOptionClick={handleFormOptionClick}
      formTitle={formTitle}
      selectTicketFormLabel={selectTicketFormLabel}
      ticketForms={ticketForms}
      isLoading={isLoading}
    />,
    options
  )
}

describe('TicketFormsListPage', () => {
  const ticketForms = [
    { id: 1, display_name: 'Form One' },
    { id: 2, display_name: 'Form Two' },
    { id: 3, display_name: 'Form Three' },
  ]

  it('renders the list of ticket forms', () => {
    const { queryByText } = renderComponent({
      ticketForms,
      selectTicketFormLabel: 'select me',
      formTitle: 'theTitle',
    })
    const texts = ['theTitle', 'select me', 'Form One', 'Form Two', 'Form Three']

    texts.forEach((text) => {
      expect(queryByText(text)).toBeInTheDocument()
    })
  })

  describe('when a form is selected', () => {
    it('fires the handleFormOptionClick', () => {
      const handleFormOptionClick = jest.fn()
      const { getByText } = renderComponent({
        ticketForms,
        handleFormOptionClick,
      })

      fireEvent.click(getByText('Form Three'))

      expect(handleFormOptionClick).toHaveBeenCalledWith(3)
    })
  })

  it('displays a loading page if a request is pending', () => {
    const { queryByRole } = renderComponent({ isLoading: true })
    expect(queryByRole('progressbar')).toBeInTheDocument()
  })
})
