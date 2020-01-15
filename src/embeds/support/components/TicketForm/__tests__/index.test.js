import React from 'react'
import { render } from 'utility/testHelpers'
import TicketForm from '../'
import useFormBackup from 'embeds/support/hooks/useFormBackup'
import useUpdateOnPrefill from 'embeds/support/hooks/useUpdateOnPrefill'
import { fireEvent } from '@testing-library/react'
import { TEST_IDS } from 'constants/shared'
import wait from 'utility/wait'

jest.mock('embeds/support/hooks/useFormBackup')
jest.mock('embeds/support/hooks/useUpdateOnPrefill')

const field1 = {
  id: 0,
  keyID: 'key:0',
  title_in_portal: 'testInputA',
  type: 'text',
  required_in_portal: false,
  visible_in_portal: true
}
const field2 = {
  id: 1,
  keyID: 'key:1',
  title_in_portal: 'testInputB',
  type: 'text',
  required_in_portal: false,
  visible_in_portal: true
}
const field3 = {
  id: 2,
  keyID: 'key:2',
  title_in_portal: 'testInputC',
  type: 'text',
  required_in_portal: false,
  visible_in_portal: true
}

describe('TicketForm', () => {
  const defaultProps = {
    submitForm: jest.fn(),
    formName: 'form name',
    ticketFields: [field1, field2, field3],
    readOnlyState: {},
    conditions: []
  }

  const renderComponent = (props = {}) => render(<TicketForm {...defaultProps} {...props} />)

  it('uses the useFormBackup hook to save the form state to redux when needed', () => {
    renderComponent()
    expect(useFormBackup).toHaveBeenCalledWith('form name')
  })

  it('uses the useUpdateOnPrefill hook to update the form when prefill values have changed', () => {
    renderComponent()
    expect(useUpdateOnPrefill).toHaveBeenCalledWith()
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
        formState: { 'key:0': 'a', 'key:1': '' },
        ...props
      })
    }

    it('calls submitForm when form is valid', async () => {
      const submitForm = jest.fn()
      const { getByText } = run({ submitForm, isValid: true })

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
      const { getByTestId } = run({ submitForm, isValid: false })

      fireEvent.click(getByTestId(TEST_IDS.SUPPORT_SUBMIT_BUTTON))

      expect(submitForm).not.toHaveBeenCalled()
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
})
