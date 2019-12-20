import React from 'react'
import { render } from 'src/util/testHelpers'
import FormStateManager from '../FormStateManager'

import useUpdateOnPrefill from 'embeds/support/hooks/useUpdateOnPrefill'
import useFormBackup from 'embeds/support/hooks/useFormBackup'

jest.mock('embeds/support/hooks/useUpdateOnPrefill')
jest.mock('embeds/support/hooks/useFormBackup')

const defaultProps = {
  formName: 'some form'
}

const renderComponent = (props = {}) => {
  return render(<FormStateManager {...defaultProps} {...props} />)
}

describe('FormStateRetriever', () => {
  it('uses the useFormBackup hook to backup the form state', () => {
    renderComponent({ formName: 'some form' })

    expect(useFormBackup).toHaveBeenCalledWith('some form')
  })

  it('uses the useUpdateOnPrefill hook to update when prefill events are fired', () => {
    renderComponent()

    expect(useUpdateOnPrefill).toHaveBeenCalled()
  })
})
