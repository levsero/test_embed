import TicketForm from '../index'
import React from 'react'
import { render } from 'src/util/testHelpers'
import { Provider } from 'react-redux'
import createStore from 'src/redux/createStore'
import { fireEvent } from '@testing-library/react'

const submitFormSpy = jest.fn()

const defaultProps = {
  formState: { '0testInputA': 'a', '1testInputB': 'b' },
  submitForm: submitFormSpy,
  ticketFields: [
    { id: 0, title_in_portal: 'testInputA', type: 'text', required_in_portal: false },
    { id: 1, title_in_portal: 'testInputB', type: 'text', required_in_portal: false }
  ],
  formName: 'testForm',
  showErrors: false,
  readOnlyState: {}
}

const renderComponent = (props, rerender) => {
  const combinedProps = {
    ...defaultProps,
    ...props
  }

  const component = (
    <Provider store={createStore()}>
      <TicketForm {...combinedProps} />
    </Provider>
  )

  return rerender ? rerender(component) : render(component)
}

describe('initialRender', () => {
  it('renders both inputs and a submit button', () => {
    const component = renderComponent()

    expect(component.getByText('testInputA')).toBeInTheDocument()
    expect(component.getByText('testInputB')).toBeInTheDocument()

    expect(component.getByText('Send')).toBeInTheDocument()
  })
})

describe('submit', () => {
  describe('when validations pass', () => {
    it('submits', () => {
      const component = renderComponent()

      fireEvent.click(component.getByText('Send'))

      expect(submitFormSpy).toHaveBeenCalled()
    })

    it('does not show field required errors', () => {
      const component = renderComponent()

      fireEvent.click(component.getByText('Send'))

      expect(component.queryByText('Please enter a value.')).toBeNull()
    })
  })

  describe('when validations will not pass', () => {
    const renderTest = () => {
      const modifiedProps = {
        ...defaultProps,
        ticketFields: [
          { id: 0, title_in_portal: 'testInputA', type: 'text', required_in_portal: true },
          { id: 1, title_in_portal: 'testInputB', type: 'text', required_in_portal: true }
        ],
        formState: { '0testInputA': 'a', '1testInputB': '' }
      }
      return renderComponent(modifiedProps)
    }

    it('renders field required errors', () => {
      const { getByTestId, getByText } = renderTest()

      fireEvent.click(getByTestId('submitButton'))
      expect(getByText('Please enter a value.')).toBeInTheDocument()
    })

    it('does not submit', () => {
      fireEvent.click(renderTest().getByText('Send'))

      expect(submitFormSpy).not.toHaveBeenCalled()
    })
  })
})

describe('error status', () => {
  it('when an error gets resolved, hides the error', () => {
    const modifiedProps = {
      ...defaultProps,
      ticketFields: [
        { id: 0, title_in_portal: 'testInputA', type: 'text', required_in_portal: true }
      ],
      formState: { '0testInputA': '' },
      showErrors: true
    }

    const { getByText, getByTestId, rerender, queryByText } = renderComponent(modifiedProps)

    fireEvent.click(getByTestId('submitButton'))

    expect(getByText('Please enter a value.')).toBeInTheDocument()

    let fixedErrorProps = { ...modifiedProps, ...{ formState: { '0testInputA': 'a' } } }

    renderComponent(fixedErrorProps, rerender)

    expect(queryByText('Please enter a value.')).toBeNull()
  })
})
