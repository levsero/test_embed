import React from 'react'
import { fireEvent } from '@testing-library/react'

import { Component as TicketFormsListPage } from '../index'
import { render } from 'src/util/testHelpers'

const renderComponent = (
  {
    handleFormOptionClick = () => {},
    selectTicketFormLabel = '',
    formTitle = '',
    ticketForms = [],
    formIds = [],
    fetchTicketForms = jest.fn(),
    locale = 'en-US'
  },
  options
) => {
  return render(
    <TicketFormsListPage
      handleFormOptionClick={handleFormOptionClick}
      formTitle={formTitle}
      selectTicketFormLabel={selectTicketFormLabel}
      ticketForms={ticketForms}
      formIds={formIds}
      fetchTicketForms={fetchTicketForms}
      locale={locale}
    />,
    options
  )
}

describe('TicketFormsListPage', () => {
  const ticketForms = [
    { id: 1, display_name: 'Form One' },
    { id: 2, display_name: 'Form Two' },
    { id: 3, display_name: 'Form Three' }
  ]

  it('renders the list of ticket forms', () => {
    const { queryByText } = renderComponent({
      ticketForms,
      selectTicketFormLabel: 'select me',
      formTitle: 'theTitle'
    })
    const texts = ['theTitle', 'select me', 'Form One', 'Form Two', 'Form Three']

    texts.forEach(text => {
      expect(queryByText(text)).toBeInTheDocument()
    })
  })

  describe('when a form is selected', () => {
    it('fires the handleFormOptionClick', () => {
      const handleFormOptionClick = jest.fn()
      const { getByText } = renderComponent({
        ticketForms,
        handleFormOptionClick
      })

      fireEvent.click(getByText('Form Three'))

      expect(handleFormOptionClick).toHaveBeenCalledWith(3)
    })
  })

  it('fetches ticket forms when list of filtered forms changes', () => {
    const fetchTicketForms = jest.fn()

    const { rerender } = renderComponent({
      fetchTicketForms,
      formIds: [123, 456],
      locale: 'en-US'
    })

    expect(fetchTicketForms).toHaveBeenCalledWith([123, 456], 'en-US')

    fetchTicketForms.mockClear()

    renderComponent(
      { formIds: [456, 789], fetchTicketForms, locale: 'en-US' },
      { render: rerender }
    )

    expect(fetchTicketForms).toHaveBeenCalledWith([456, 789], 'en-US')
  })
})
