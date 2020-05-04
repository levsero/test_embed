import React from 'react'
import { render } from 'utility/testHelpers'
import TicketForm from '../'
import useFormBackup from 'embeds/support/hooks/useFormBackup'
import useWidgetFormApis from 'embeds/support/hooks/useWidgetFormApis'
import { fireEvent } from '@testing-library/react'
import { TEST_IDS } from 'constants/shared'
import wait from 'utility/wait'
import createKeyID from 'embeds/support/utils/createKeyID'

jest.mock('embeds/support/hooks/useFormBackup')
jest.mock('embeds/support/hooks/useWidgetFormApis')

describe('TicketForm', () => {
  const field1 = {
    id: 0,
    keyID: createKeyID(0),
    title_in_portal: 'testInputA',
    type: 'text',
    required_in_portal: false,
    visible_in_portal: true
  }
  const field2 = {
    id: 1,
    keyID: createKeyID(1),
    title_in_portal: 'testInputB',
    type: 'text',
    required_in_portal: false,
    visible_in_portal: true
  }
  const field3 = {
    id: 2,
    keyID: createKeyID(2),
    title_in_portal: 'testInputC',
    type: 'text',
    required_in_portal: false,
    visible_in_portal: true
  }

  const defaultProps = {
    submitForm: jest.fn(),
    formId: 'formId',
    ticketFields: [field1, field2, field3],
    readOnlyState: {},
    conditions: [],
    ticketFormTitle: 'form title',
    isPreview: false
  }

  const renderComponent = (props = {}) => render(<TicketForm {...defaultProps} {...props} />)

  it('uses the useFormBackup hook to save the form state to redux when needed', () => {
    renderComponent()
    expect(useFormBackup).toHaveBeenCalledWith('formId')
  })

  it('renders the title', () => {
    const { queryByText } = renderComponent()

    expect(queryByText('form title')).toBeInTheDocument()
  })

  it('uses the useUpdateOnPrefill hook to update the form when prefill values have changed', () => {
    renderComponent()
    expect(useWidgetFormApis).toHaveBeenCalledWith(defaultProps.formId, defaultProps.ticketFields)
  })

  describe('conditional field logic', () => {
    const run = ({ ticketFieldsRequired = true, conditionRequired = true } = {}) => {
      const result = renderComponent({
        ticketFields: [
          {
            id: 0,
            keyID: createKeyID(0),
            title_in_portal: 'testInputA',
            type: 'text',
            required_in_portal: ticketFieldsRequired,
            visible_in_portal: true
          },
          {
            id: 1,
            keyID: createKeyID(1),
            title_in_portal: 'testInputB',
            type: 'text',
            required_in_portal: true,
            visible_in_portal: true
          }
        ],
        conditions: [
          {
            parent_field_id: 1,
            value: 'something',
            child_fields: [
              {
                id: 0,
                is_required: conditionRequired
              }
            ]
          }
        ]
      })

      const parentField = result.queryByLabelText('testInputB')

      const isRequired = conditionRequired || ticketFieldsRequired

      return {
        ...result,
        getField: () => {
          return result.queryByLabelText(isRequired ? 'testInputA' : 'testInputA (optional)')
        },
        parentField
      }
    }

    it('displays the field when the condition is met', () => {
      const { queryByLabelText, getField, parentField } = run()

      expect(getField()).not.toBeInTheDocument()
      fireEvent.change(parentField, { target: { value: 'something' } })

      expect(queryByLabelText('testInputA')).toBeInTheDocument()
    })

    it('hides the field when the condition is no longer met', () => {
      const { getField, parentField } = run()

      fireEvent.change(parentField, { target: { value: 'something' } })

      expect(getField()).toBeInTheDocument()

      fireEvent.change(parentField, { target: { value: 'something else' } })

      expect(getField()).not.toBeInTheDocument()
    })

    it('makes the field required if the condition specifies it is required', () => {
      const { getField, parentField } = run({
        conditionRequired: true,
        ticketFieldsRequired: false
      })

      expect(getField()).not.toBeInTheDocument()

      fireEvent.change(parentField, { target: { value: 'something' } })

      expect(getField()).toBeRequired()
    })

    it('makes the field required if the field specifies it is required', () => {
      const { getField, parentField } = run({
        conditionRequired: false,
        ticketFieldsRequired: true
      })

      expect(getField()).not.toBeInTheDocument()

      fireEvent.change(parentField, { target: { value: 'something' } })

      expect(getField()).toBeRequired()
    })

    it('makes the field not required if both field and condition specify not required', () => {
      const { getField, parentField } = run({
        conditionRequired: false,
        ticketFieldsRequired: false
      })

      expect(getField()).not.toBeInTheDocument()

      fireEvent.change(parentField, { target: { value: 'something' } })

      expect(getField()).not.toBeRequired()
    })
  })

  describe('submit', () => {
    const run = ({ isValid = true, ...props } = {}) => {
      return renderComponent({
        ticketFields: [
          field1,
          {
            ...field2,
            required_in_portal: !isValid
          }
        ],
        formState: {
          [createKeyID(0)]: 'a',
          [createKeyID(1)]: ''
        },
        ...props
      })
    }

    it('calls submitForm when form is valid', async () => {
      const submitForm = jest.fn()
      const { getByText } = run({
        submitForm,
        isValid: true
      })

      fireEvent.click(getByText('Send'))

      await wait()

      expect(submitForm).toHaveBeenCalled()
    })

    it('renders error messages if the form is not valid', async () => {
      const { getByTestId, getByText } = run({ isValid: false })

      fireEvent.click(getByTestId(TEST_IDS.SUPPORT_SUBMIT_BUTTON))

      await wait()

      expect(getByText('Please enter a value.')).toBeInTheDocument()
    })

    it('does not display error messages until the form has been submitted', async () => {
      const { getByTestId, queryByText, getByLabelText } = run({ isValid: false })

      const getErrorMessage = () => queryByText('Please enter a value.')
      const field = getByLabelText('testInputB')

      expect(getErrorMessage()).not.toBeInTheDocument()

      fireEvent.click(getByTestId(TEST_IDS.SUPPORT_SUBMIT_BUTTON))

      await wait()

      expect(getErrorMessage()).toBeInTheDocument()

      fireEvent.change(field, { target: { value: 'something' } })

      expect(getErrorMessage()).not.toBeInTheDocument()

      fireEvent.change(field, { target: { value: '' } })

      expect(getErrorMessage()).toBeInTheDocument()
    })

    it('does not call submitForm if the form is not valid', () => {
      const submitForm = jest.fn()
      const { getByTestId } = run({
        submitForm,
        isValid: false
      })

      fireEvent.click(getByTestId(TEST_IDS.SUPPORT_SUBMIT_BUTTON))

      expect(submitForm).not.toHaveBeenCalled()
    })

    it('does not submit values for fields that have not met their conditions', () => {
      const submitForm = jest.fn()
      const { getByTestId } = run({
        submitForm,
        ticketFields: [field1, field2],
        formState: {
          [createKeyID(field1.id)]: 'dog',
          [createKeyID(field2.id)]: ''
        },
        conditions: [
          {
            parent_field_id: field1.id,
            value: 'cat',
            child_fields: [
              {
                id: field2.id,
                is_required: false
              }
            ]
          }
        ]
      })

      fireEvent.click(getByTestId(TEST_IDS.SUPPORT_SUBMIT_BUTTON))

      expect(submitForm).toHaveBeenCalledWith({
        [field1.id]: 'dog'
      })
    })

    it('includes values for fields that have met their conditions', () => {
      const submitForm = jest.fn()
      const { getByTestId } = run({
        submitForm,
        ticketFields: [field1, field2],
        formState: {
          [createKeyID(field1.id)]: 'cat',
          [createKeyID(field2.id)]: 'fish'
        },
        conditions: [
          {
            parent_field_id: field1.id,
            value: 'cat',
            child_fields: [
              {
                id: field2.id,
                is_required: false
              }
            ]
          }
        ]
      })

      fireEvent.click(getByTestId(TEST_IDS.SUPPORT_SUBMIT_BUTTON))

      expect(submitForm).toHaveBeenCalledWith({
        [field1.id]: 'cat',
        [field2.id]: 'fish'
      })
    })
  })

  describe('submit button', () => {
    it('has a type submit so it can submit the form', () => {
      const { queryByTestId } = renderComponent()

      expect(queryByTestId(TEST_IDS.SUPPORT_SUBMIT_BUTTON).getAttribute('type')).toEqual('submit')
    })

    describe('when the form is submitting', () => {
      const run = async () => {
        const submitForm = jest.fn(() => new Promise(() => {}))
        const result = renderComponent({ submitForm })

        fireEvent.click(result.getByText('Send'))

        await wait()

        return result
      }

      it('displays text to show that the form is currently submitting', async () => {
        const { queryByTestId } = await run()

        expect(queryByTestId(TEST_IDS.SUPPORT_SUBMIT_BUTTON)).toHaveTextContent('Submitting...')
      })

      it('is disabled', async () => {
        const { queryByTestId } = await run()

        await expect(queryByTestId(TEST_IDS.SUPPORT_SUBMIT_BUTTON)).toBeDisabled()
      })
    })

    describe('when the form is not currently submitting', () => {
      it('renders text to show that it submits the form', () => {
        const { queryByTestId } = renderComponent({ isSubmitting: false })

        expect(queryByTestId(TEST_IDS.SUPPORT_SUBMIT_BUTTON)).toHaveTextContent('Send')
      })

      it('is not disabled', () => {
        const { queryByTestId } = renderComponent({ isSubmitting: false })

        expect(queryByTestId(TEST_IDS.SUPPORT_SUBMIT_BUTTON)).not.toBeDisabled()
      })
    })
  })

  it('displays an error message when the form failed to submit', async () => {
    const submitForm = jest.fn(
      () =>
        new Promise((_, rej) => {
          rej('embeddable_framework.submitTicket.notify.message.error')
        })
    )
    const result = renderComponent({ submitForm })

    fireEvent.click(result.getByText('Send'))

    await wait()

    expect(
      result.queryByText('There was an error processing your request. Please try again later.')
    ).toBeInTheDocument()
  })

  describe('in preview mode', () => {
    it('does not submit', () => {
      const submitForm = jest.fn(
        () =>
          new Promise(res => {
            res('embeddable_framework.submitTicket.notify.message.error')
          })
      )
      const { getByText, queryByText } = renderComponent({ submitForm, isPreview: true })

      fireEvent.click(getByText('Send'))

      expect(queryByText('Submitting...')).not.toBeInTheDocument()
    })

    it('renders all inputs as read only', () => {
      const submitForm = jest.fn(
        () =>
          new Promise(res => {
            res('embeddable_framework.submitTicket.notify.message.error')
          })
      )
      const { queryByLabelText } = renderComponent({
        submitForm,
        isPreview: true,
        fields: [field1, field2, field3],
        readOnlyState: {}
      })

      expect(queryByLabelText(field1.title_in_portal)).toHaveAttribute('readonly')
      expect(queryByLabelText(field2.title_in_portal)).toHaveAttribute('readonly')
      expect(queryByLabelText(field3.title_in_portal)).toHaveAttribute('readonly')
    })
  })
})
