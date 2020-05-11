import { useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useForm } from 'react-final-form'
import useOnClear from 'embeds/webWidget/hooks/useOnClear'
import { getLocale } from 'src/redux/modules/base/base-selectors'
import useOnChange from 'src/hooks/useOnChange'
import createKeyID from 'embeds/support/utils/createKeyID'
import { getValues } from 'src/redux/modules/customerProvidedPrefill/selectors'

const useWidgetFormApis = (formId, fields = []) => {
  const form = useForm()
  const locale = useSelector(getLocale)
  const formFields = useSelector(state => getValues(state, 'supportFields'))
  const specificFormFields = useSelector(state => getValues(state, 'supportCustomFormFields'))
  const prefill = useSelector(state => getValues(state, 'prefill'))

  const onClear = useCallback(() => {
    form.reset({})
  }, [form])
  useOnClear(onClear)

  const overwriteFormWithProvidedValues = useCallback(() => {
    form.batch(() => {
      const fieldsById = fields.reduce(
        (prev, next) => ({
          ...prev,
          [next.id]: next
        }),
        {}
      )

      const fieldsToUpdate = {
        ...(prefill || {}),
        ...(formFields['*'] || {}),
        ...(formFields[locale] || {}),
        ...specificFormFields[formId]?.['*'],
        ...specificFormFields[formId]?.[locale]
      }

      Object.keys(fieldsToUpdate).forEach(key => {
        if (fieldsById[key]) {
          form.change(fieldsById[key].keyID, fieldsToUpdate[key])
        } else {
          form.change(createKeyID(key), fieldsToUpdate[key])
        }
      })
    })
  }, [form, formId, locale, formFields, specificFormFields, prefill])

  useOnChange('supportFields', `support-${formId}`, overwriteFormWithProvidedValues)
  useOnChange('supportCustomFormFields', `support-${formId}`, overwriteFormWithProvidedValues)
  useOnChange('prefill', `support-${formId}`, overwriteFormWithProvidedValues)
  useEffect(overwriteFormWithProvidedValues, [locale])
}

export default useWidgetFormApis
