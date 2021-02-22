import { useForm } from 'react-final-form'
import { wait } from '@testing-library/react'
import { render } from 'src/util/testHelpers'
import { handlePrefillReceived } from 'src/redux/modules/base'
import useWidgetFormApis from '../useWidgetFormApis'
import createKeyID from 'embeds/support/utils/createKeyID'
import { updateSettings } from 'src/redux/modules/settings'
import { LOCALE_SET } from 'src/redux/modules/base/base-action-types'

jest.mock('react-final-form')

describe('useWidgetFormApis', () => {
  const ExampleComponent = ({ formId, fields }) => {
    useWidgetFormApis(formId, fields)
    return null
  }

  const renderComponent = (props = {}, options) => {
    const result = render(<ExampleComponent {...props} />, options)

    result.updateField = (id, value) => {
      result.store.dispatch(
        updateSettings({
          contactForm: {
            fields: [
              {
                id: id,
                prefill: {
                  '*': value,
                },
              },
            ],
          },
        })
      )
    }

    return result
  }

  let mockChange
  let mockReset

  beforeEach(() => {
    mockChange = jest.fn()
    mockReset = jest.fn()

    useForm.mockReturnValue({
      batch: (cb) => {
        cb()
      },
      change: mockChange,
      reset: mockReset,
    })
  })

  it('updates the form when the user has called the prefill api', async () => {
    const { store } = renderComponent()

    store.dispatch(
      handlePrefillReceived({
        name: {
          value: 'Some name',
        },
      })
    )

    await wait(() => expect(mockChange).toHaveBeenCalledWith(createKeyID('name'), 'Some name'))

    store.dispatch(
      handlePrefillReceived({
        name: {
          value: 'Another name',
        },
      })
    )

    await wait(() => expect(mockChange).toHaveBeenCalledWith(createKeyID('name'), 'Another name'))
  })

  it('updates the form when the user has updated the fields setting', async () => {
    const { updateField } = renderComponent()

    updateField('description', 'Something')

    await wait(() =>
      expect(mockChange).toHaveBeenCalledWith(createKeyID('description'), 'Something')
    )
  })

  it('updates the form when the user has updated the ticketForms setting', async () => {
    const formId = '123'
    const { store } = renderComponent({ formId })

    store.dispatch(
      updateSettings({
        contactForm: {
          ticketForms: [
            {
              id: formId,
              fields: [
                {
                  id: 'description',
                  prefill: {
                    '*': 'Description',
                  },
                },
              ],
            },
          ],
        },
      })
    )

    await wait(() =>
      expect(mockChange).toHaveBeenCalledWith(createKeyID('description'), 'Description')
    )
  })

  it('prioritises support settings and specific locale settings over prefill and general locale settings', async () => {
    const formId = '123'
    const { store } = renderComponent({ formId })

    store.dispatch(
      updateSettings({
        contactForm: {
          fields: [
            {
              id: 'name',
              prefill: {
                '*': 'Name',
                fr: 'French name',
              },
            },
            {
              id: 'description',
              prefill: {
                '*': 'Something',
              },
            },
          ],
          ticketForms: [
            {
              id: formId,
              fields: [
                {
                  id: 'description',
                  prefill: {
                    '*': 'Specific form description',
                  },
                },
              ],
            },
          ],
        },
      })
    )

    store.dispatch(
      handlePrefillReceived({
        name: {
          value: 'Prefill name',
        },
        phone: {
          value: '123 123 123',
        },
      })
    )

    mockChange.mockClear()

    store.dispatch({
      type: LOCALE_SET,
      payload: 'fr',
    })

    await wait(() =>
      expect(mockChange).toHaveBeenCalledWith(
        createKeyID('description'),
        'Specific form description'
      )
    )
    await wait(() => expect(mockChange).toHaveBeenCalledWith(createKeyID('name'), 'French name'))
    await wait(expect(mockChange).toHaveBeenCalledWith(createKeyID('phone'), '123 123 123'))
  })

  it('updates a field when its originalId matches the key to update', async () => {
    const formId = '123'
    const fields = [
      {
        id: createKeyID('12345'),
        originalId: '12345',
      },
    ]
    const { updateField } = renderComponent({ formId, fields })

    updateField('12345', 'Description')

    await wait(() => expect(mockChange).toHaveBeenCalledWith(createKeyID('12345'), 'Description'))
  })

  it('updates a field when its id matches the key to update', async () => {
    const formId = '123'
    const fields = [
      {
        id: 'description',
        originalId: '12345',
      },
    ]
    const { updateField } = renderComponent({ formId, fields })

    updateField('description', 'Description')

    await wait(() => expect(mockChange).toHaveBeenCalledWith('description', 'Description'))
  })

  it('prefers custom field names over custom field ids', async () => {
    const formId = '123'
    const fields = [
      {
        id: 'description',
        originalId: '12345',
      },
    ]

    const { updateField } = renderComponent({ formId, fields })

    updateField('12345', 'One')
    await wait(() => expect(mockChange).toHaveBeenCalledWith('description', 'One'))

    updateField('description', 'Two')
    await wait(() => expect(mockChange).toHaveBeenCalledWith('description', 'Two'))

    updateField('12345', 'Three')
    await wait(() => expect(mockChange).toHaveBeenCalledWith('description', 'Two'))
  })
})
