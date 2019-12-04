import React from 'react'
import { render } from '@testing-library/react'
import { useSubmit } from '../useSubmit'
import { fireEvent } from '@testing-library/react'
import * as fieldConversionTools from 'src/embeds/support/utils/fieldConversion'

const callback = jest.fn()
const propsSubmit = jest.fn()
const propsSetShowFormErrors = jest.fn()
const formData = {
  name: 'bob',
  email: 'hey@person-reading.this'
}

// eslint-disable-next-line react/prop-types
const SomeComponent = ({ callback, validate, setShowFormErrors }) => {
  jest.spyOn(fieldConversionTools, 'getParsedValues').mockReturnValue(formData)
  const submit = useSubmit(propsSubmit, validate, setShowFormErrors)

  return (
    <div>
      <button onClick={_e => submit({}, {}, callback)}>SUBMIT</button>
    </div>
  )
}

describe('useSubmit', () => {
  describe('when validate returns no errors', () => {
    it('calls the callback with true', () => {
      const validateFn = () => ({})

      const component = render(<SomeComponent callback={callback} validate={validateFn} />)

      fireEvent.click(component.getByText('SUBMIT'))

      expect(callback).toHaveBeenCalledWith(true)
    })

    it('calls submit with the form data', () => {
      const validateFn = () => ({})
      const component = render(<SomeComponent callback={callback} validate={validateFn} />)

      fireEvent.click(component.getByText('SUBMIT'))

      expect(propsSubmit).toHaveBeenCalledWith(formData)
    })
  })
  describe('when validate returns errors', () => {
    it('calls the callback with false', () => {
      const validateFn = () => ({ name: 'empty!' })

      const component = render(
        <SomeComponent
          callback={callback}
          validate={validateFn}
          setShowFormErrors={propsSetShowFormErrors}
        />
      )

      fireEvent.click(component.getByText('SUBMIT'))

      expect(callback).toHaveBeenCalledWith(false)
    })

    it('calls setShowFormErrors with true', () => {
      const validateFn = () => ({ name: 'empty!' })

      const component = render(
        <SomeComponent
          callback={callback}
          validate={validateFn}
          setShowFormErrors={propsSetShowFormErrors}
        />
      )

      fireEvent.click(component.getByText('SUBMIT'))

      expect(propsSetShowFormErrors).toHaveBeenCalledWith(true)
    })
  })
})
