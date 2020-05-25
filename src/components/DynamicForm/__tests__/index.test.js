import React from 'react'
import { render } from 'utility/testHelpers'
import useFormBackup from 'src/components/DynamicForm/hooks/useFormBackup'
import { fireEvent } from '@testing-library/react'
import wait from 'utility/wait'
import DynamicForm from '../.'
import { apiClearForm } from 'src/redux/modules/base'

jest.mock('src/components/DynamicForm/hooks/useFormBackup')

describe('DynamicForm', () => {
  const field1 = {
    id: 'id:0',
    title: 'testInputA',
    type: 'text',
    required: false,
    visible: true
  }
  const field2 = {
    id: 'id:1',
    title: 'testInputB',
    type: 'text',
    required: false,
    visible: true
  }
  const field3 = {
    id: 'id:2',
    title: 'testInputC',
    type: 'text',
    required: false,
    visible: true
  }

  const defaultProps = {
    onSubmit: jest.fn(),
    formId: 'formId',
    getFields: () => [field1, field2, field3],
    isPreview: false,
    footer: () => <button type="submit">Send</button>,
    validate: () => true
  }

  const renderComponent = (props = {}) => render(<DynamicForm {...defaultProps} {...props} />)

  it('uses the useFormBackup hook to save the form state to redux when needed', () => {
    renderComponent()
    expect(useFormBackup).toHaveBeenCalledWith('formId')
  })

  it('clears the form when the clear api is called', async () => {
    const { store, getByLabelText } = renderComponent({
      getFields: () => [
        {
          ...field1,
          required: true
        },
        {
          ...field2,
          required: true
        }
      ]
    })

    fireEvent.change(getByLabelText(field1.title), { target: { value: 'One' } })
    fireEvent.change(getByLabelText(field2.title), { target: { value: 'Two' } })

    expect(getByLabelText(field1.title)).toHaveValue('One')
    expect(getByLabelText(field2.title)).toHaveValue('Two')

    store.dispatch(apiClearForm())

    expect(getByLabelText(field1.title)).toHaveValue('')
    expect(getByLabelText(field2.title)).toHaveValue('')
  })

  it('can mark fields as read only with the readOnlyValues prop', () => {
    const { queryByLabelText } = renderComponent({
      getFields: () => [
        {
          ...field1,
          required: true
        },
        {
          ...field2,
          required: true
        }
      ],
      readOnlyValues: {
        [field1.id]: true,
        [field2.id]: false
      }
    })

    expect(queryByLabelText(field1.title)).toHaveAttribute('readonly')
    expect(queryByLabelText(field2.title)).not.toHaveAttribute('readonly')
  })

  describe('submit', () => {
    const run = ({ ...props } = {}) => {
      return renderComponent({
        getFields: () => [field1, field2],
        ...props
      })
    }

    it('calls onSubmit when form is valid', async () => {
      const onSubmit = jest.fn()
      const { getByText, getByLabelText } = run({
        onSubmit,
        validate: () => undefined
      })

      fireEvent.change(getByLabelText(`${field1.title} (optional)`), { target: { value: 'One' } })
      fireEvent.change(getByLabelText(`${field2.title} (optional)`), { target: { value: 'Two' } })

      fireEvent.click(getByText('Send'))

      await wait()

      expect(onSubmit).toHaveBeenCalledWith({
        [field1.id]: 'One',
        [field2.id]: 'Two'
      })
    })

    it('renders error messages if the form is not valid', async () => {
      const { getByText } = run({
        validate: () => ({
          [field2.id]: 'embeddable_framework.validation.error.input'
        })
      })

      fireEvent.click(getByText('Send'))

      await wait()

      expect(getByText('Please enter a value.')).toBeInTheDocument()
    })

    it('does not display error messages until the form has been submitted', async () => {
      const { getByText, queryByText, getByLabelText } = run({
        getFields: () => [
          field1,
          {
            ...field2,
            required: true
          }
        ],
        validate: values => {
          if (values[field2.id]) {
            return
          }

          return {
            [field2.id]: 'embeddable_framework.validation.error.input'
          }
        }
      })

      const getErrorMessage = () => queryByText('Please enter a value.')
      const field = getByLabelText('testInputB')

      expect(getErrorMessage()).not.toBeInTheDocument()

      fireEvent.click(getByText('Send'))

      await wait()

      expect(getErrorMessage()).toBeInTheDocument()

      fireEvent.change(field, { target: { value: 'something' } })

      expect(getErrorMessage()).not.toBeInTheDocument()

      fireEvent.change(field, { target: { value: '' } })

      expect(getErrorMessage()).toBeInTheDocument()
    })

    it('does not call onSubmit if the form is not valid', () => {
      const onSubmit = jest.fn()
      const { getByText } = run({
        onSubmit,
        validate: () => ({ [field1.id]: 'some error' })
      })

      fireEvent.click(getByText('Send'))

      expect(onSubmit).not.toHaveBeenCalled()
    })
  })

  it('displays an error message when the form failed to submit', async () => {
    const onSubmit = jest.fn(
      () =>
        new Promise((_, rej) => {
          rej('embeddable_framework.submitTicket.notify.message.error')
        })
    )
    const result = renderComponent({ onSubmit })

    fireEvent.click(result.getByText('Send'))

    await wait(() =>
      expect(
        result.getByText('There was an error processing your request. Please try again later.')
      ).toBeInTheDocument()
    )
  })

  describe('in preview mode', () => {
    it('does not submit', () => {
      const onSubmit = jest.fn(
        () =>
          new Promise(res => {
            res('embeddable_framework.submitTicket.notify.message.error')
          })
      )
      const { getByText, queryByText } = renderComponent({ onSubmit, isPreview: true })

      fireEvent.click(getByText('Send'))

      expect(queryByText('Submitting...')).not.toBeInTheDocument()
    })

    it('renders all inputs as read only', () => {
      const onSubmit = jest.fn(
        () =>
          new Promise(res => {
            res('embeddable_framework.submitTicket.notify.message.error')
          })
      )
      const { queryByLabelText } = renderComponent({
        onSubmit,
        isPreview: true,
        getFields: () => [field1, field2, field3]
      })

      expect(queryByLabelText(field1.title)).toHaveAttribute('readonly')
      expect(queryByLabelText(field2.title)).toHaveAttribute('readonly')
      expect(queryByLabelText(field3.title)).toHaveAttribute('readonly')
    })
  })

  describe('footer', () => {
    it('is rendered within the form element so that buttons can submit the form', () => {
      const Footer = () => <button data-testid="footer">Footer</button>
      const { container } = renderComponent({ footer: Footer })

      expect(container.querySelector('form').querySelector('[data-testid="footer"]')).toBeTruthy()
    })

    it('is called with an isSubmitting prop', () => {
      // eslint-disable-next-line react/prop-types
      const Footer = ({ isSubmitting }) => (
        <button data-testid="footer">{isSubmitting ? 'Sending' : 'Send'}</button>
      )
      const { getByText } = renderComponent({ footer: Footer })

      expect(getByText('Send')).toBeInTheDocument()

      fireEvent.click(getByText('Send'))

      expect(getByText('Sending')).toBeInTheDocument()
    })
  })
})