import { fireEvent } from '@testing-library/react'
import { TEST_IDS } from 'src/constants/shared'
import useWidgetFormApis from 'src/embeds/support/hooks/useWidgetFormApis'
import createKeyID from 'src/embeds/support/utils/createKeyID'
import { render } from 'src/util/testHelpers'
import wait from 'src/util/wait'
import { Component as TicketForm } from '../'

jest.mock('src/embeds/support/hooks/useWidgetFormApis')

describe('TicketForm', () => {
  const field1 = {
    id: createKeyID(0),
    originalId: 0,
    title: 'testInputA',
    type: 'text',
    required: false,
    visible: true,
  }
  const field2 = {
    id: createKeyID(1),
    originalId: 1,
    title: 'testInputB',
    type: 'text',
    required: false,
    visible: true,
  }
  const field3 = {
    id: createKeyID(2),
    originalId: 2,
    title: 'testInputC',
    type: 'text',
    required: false,
    visible: true,
  }

  const defaultProps = {
    submitTicket: jest.fn(),
    formOpened: jest.fn(),
    formId: 'formId',
    ticketFields: [field1, field2, field3],
    readOnlyState: {},
    conditions: [],
    ticketFormTitle: 'form title',
    isPreview: false,
  }

  const renderComponent = (props = {}) => render(<TicketForm {...defaultProps} {...props} />)

  it('renders the title', () => {
    const { queryByText } = renderComponent()

    expect(queryByText('form title')).toBeInTheDocument()
  })

  it('uses the useWidgetFormApis hook to update the form when prefill values have changed', () => {
    renderComponent()
    expect(useWidgetFormApis).toHaveBeenCalledWith(defaultProps.formId, defaultProps.ticketFields)
  })

  describe('conditional field logic', () => {
    const run = ({ ticketFieldsRequired = true, conditionRequired = true } = {}) => {
      const result = renderComponent({
        ticketFields: [
          {
            id: createKeyID(0),
            originalId: 0,
            title: 'testInputA',
            type: 'text',
            required: ticketFieldsRequired,
            visible: true,
          },
          {
            id: createKeyID(1),
            originalId: 1,
            title: 'testInputB',
            type: 'text',
            required: true,
            visible: true,
          },
        ],
        conditions: [
          {
            parent_field_id: 1,
            value: 'something',
            child_fields: [
              {
                id: 0,
                is_required: conditionRequired,
              },
            ],
          },
        ],
      })

      const parentField = result.queryByLabelText('testInputB')

      const isRequired = conditionRequired || ticketFieldsRequired

      return {
        ...result,
        getField: () => {
          return result.queryByLabelText(isRequired ? 'testInputA' : 'testInputA (optional)')
        },
        parentField,
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
        ticketFieldsRequired: false,
      })

      expect(getField()).not.toBeInTheDocument()

      fireEvent.change(parentField, { target: { value: 'something' } })

      expect(getField()).toBeRequired()
    })

    it('makes the field required if the field specifies it is required', () => {
      const { getField, parentField } = run({
        conditionRequired: false,
        ticketFieldsRequired: true,
      })

      expect(getField()).not.toBeInTheDocument()

      fireEvent.change(parentField, { target: { value: 'something' } })

      expect(getField()).toBeRequired()
    })

    it('makes the field not required if both field and condition specify not required', () => {
      const { getField, parentField } = run({
        conditionRequired: false,
        ticketFieldsRequired: false,
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
            required: !isValid,
          },
        ],
        formState: {
          [createKeyID(0)]: 'a',
          [createKeyID(1)]: '',
        },
        ...props,
      })
    }

    it('calls submitTicket when form is valid', async () => {
      const submitTicket = jest.fn()
      const { getByText } = run({
        submitTicket,
        isValid: true,
      })

      fireEvent.click(getByText('Send'))

      await wait()

      expect(submitTicket).toHaveBeenCalled()
    })

    it('renders error messages if the form is not valid', async () => {
      const { getByTestId, getByText } = run({ isValid: false })

      fireEvent.click(getByTestId(TEST_IDS.BUTTON_OK))

      await wait()

      expect(getByText('Please enter a value.')).toBeInTheDocument()
    })

    it('does not display error messages until the form has been submitted', async () => {
      const { getByTestId, queryByText, getByLabelText } = run({ isValid: false })

      const getErrorMessage = () => queryByText('Please enter a value.')
      const field = getByLabelText('testInputB')

      expect(getErrorMessage()).not.toBeInTheDocument()

      fireEvent.click(getByTestId(TEST_IDS.BUTTON_OK))

      await wait()

      expect(getErrorMessage()).toBeInTheDocument()

      fireEvent.change(field, { target: { value: 'something' } })

      expect(getErrorMessage()).not.toBeInTheDocument()

      fireEvent.change(field, { target: { value: '' } })

      expect(getErrorMessage()).toBeInTheDocument()
    })

    it('does not call submitTicket if the form is not valid', () => {
      const submitTicket = jest.fn()
      const { getByTestId } = run({
        submitTicket,
        isValid: false,
      })

      fireEvent.click(getByTestId(TEST_IDS.BUTTON_OK))

      expect(submitTicket).not.toHaveBeenCalled()
    })

    it('does not submit values for fields that have not met their conditions', async () => {
      const submitTicket = jest.fn()
      const { getByTestId } = run({
        submitTicket,
        initialValues: {
          [field1.id]: 'dog',
        },
        ticketFields: [field1, field2],
        conditions: [
          {
            parent_field_id: field1.originalId,
            value: 'cat',
            child_fields: [
              {
                id: field2.originalId,
                is_required: false,
              },
            ],
          },
        ],
      })

      await fireEvent.click(getByTestId(TEST_IDS.BUTTON_OK))

      expect(submitTicket).toHaveBeenCalledWith(
        {
          [field1.originalId]: 'dog',
        },
        defaultProps.formId,
        [field1]
      )
    })

    it('includes values for fields that have met their conditions', () => {
      const submitTicket = jest.fn()
      const { getByTestId } = run({
        submitTicket,
        ticketFields: [field1, field2],
        initialValues: {
          [field1.id]: 'cat',
          [field2.id]: 'fish',
        },
        conditions: [
          {
            parent_field_id: field1.originalId,
            value: 'cat',
            child_fields: [
              {
                id: field2.originalId,
                is_required: false,
              },
            ],
          },
        ],
      })

      fireEvent.click(getByTestId(TEST_IDS.BUTTON_OK))

      expect(submitTicket).toHaveBeenCalledWith(
        {
          [field1.originalId]: 'cat',
          [field2.originalId]: 'fish',
        },
        defaultProps.formId,
        [field1, field2]
      )
    })
  })

  describe('submit button', () => {
    it('has a type submit so it can submit the form', () => {
      const { queryByTestId } = renderComponent()

      expect(queryByTestId(TEST_IDS.BUTTON_OK).getAttribute('type')).toEqual('submit')
    })

    describe('when the form is submitting', () => {
      const run = async () => {
        const submitTicket = jest.fn(() => new Promise(() => {}))
        const result = renderComponent({ submitTicket })

        fireEvent.click(result.getByText('Send'))

        await wait()

        return result
      }

      it('displays dots to show that the form is currently submitting', async () => {
        const { queryByTestId } = await run()

        expect(queryByTestId(TEST_IDS.DOTS)).toBeInTheDocument()
      })
    })

    describe('when the form is not currently submitting', () => {
      it('renders text to show that it submits the form', () => {
        const { queryByTestId } = renderComponent({ isSubmitting: false })

        expect(queryByTestId(TEST_IDS.BUTTON_OK)).toHaveTextContent('Send')
      })

      it('is not disabled', () => {
        const { queryByTestId } = renderComponent({ isSubmitting: false })

        expect(queryByTestId(TEST_IDS.BUTTON_OK)).not.toBeDisabled()
      })
    })
  })

  it('displays an error message when the form failed to submit', async () => {
    const submitTicket = jest.fn(
      () =>
        new Promise((_, rej) => {
          rej('embeddable_framework.submitTicket.notify.message.error')
        })
    )
    const result = renderComponent({ submitTicket })

    fireEvent.click(result.getByText('Send'))

    await wait()

    expect(
      result.queryByText('There was an error processing your request. Please try again later.')
    ).toBeInTheDocument()
  })

  describe('in preview mode', () => {
    it('does not submit', () => {
      const submitTicket = jest.fn(
        () =>
          new Promise((res) => {
            res('embeddable_framework.submitTicket.notify.message.error')
          })
      )
      const { getByText, queryByText } = renderComponent({ submitTicket, isPreview: true })

      fireEvent.click(getByText('Send'))

      expect(queryByText('Submitting...')).not.toBeInTheDocument()
    })

    it('renders all inputs as read only', () => {
      const submitTicket = jest.fn(
        () =>
          new Promise((res) => {
            res('embeddable_framework.submitTicket.notify.message.error')
          })
      )
      const { queryByLabelText } = renderComponent({
        submitTicket,
        isPreview: true,
        fields: [field1, field2, field3],
        readOnlyState: {},
      })

      expect(queryByLabelText(`${field1.title} (optional)`)).toHaveAttribute('readonly')
      expect(queryByLabelText(`${field2.title} (optional)`)).toHaveAttribute('readonly')
      expect(queryByLabelText(`${field3.title} (optional)`)).toHaveAttribute('readonly')
    })
  })
})
