import { useEffect, useCallback } from 'react'
import { useForm } from 'react-final-form'
import { useSelector } from 'react-redux'
import createKeyID from 'embeds/support/utils/createKeyID'
import useOnChange from 'src/hooks/useOnChange'
import { getLocale } from 'src/redux/modules/base/base-selectors'
import { getValues } from 'src/redux/modules/customerProvidedPrefill/selectors'

const useWidgetFormApis = (formId, fields = []) => {
  const form = useForm()
  const locale = useSelector(getLocale)
  const formFields = useSelector((state) => getValues(state, 'supportFields'))
  const specificFormFields = useSelector((state) => getValues(state, 'supportCustomFormFields'))
  const prefill = useSelector((state) => getValues(state, 'prefill'))

  const overwriteFormWithProvidedValues = useCallback(() => {
    form.batch(() => {
      const fieldsById = fields.reduce(
        (prev, next) => ({
          ...prev,
          [next.id]: next,
        }),
        {}
      )
      const fieldsByOriginalId = fields.reduce(
        (prev, next) => ({
          ...prev,
          [next.originalId]: next,
        }),
        {}
      )

      const fieldsToUpdate = {
        ...(prefill || {}),
        ...(formFields['*'] || {}),
        ...(formFields[locale] || {}),
        ...specificFormFields[formId]?.['*'],
        ...specificFormFields[formId]?.[locale],
      }

      Object.keys(fieldsToUpdate).forEach((key) => {
        const field = fieldsById[key]

        // If the field key matches a field's id directly this means it is for a field like
        // "description" or "email" and not a custom field.
        if (field) {
          form.change(key, fieldsToUpdate[key])
          return
        }

        const customField = fieldsByOriginalId[key]

        if (customField) {
          // If the fields id is not just a string wrapper for its number id, that means it is one of the fields
          // that we give a custom name to like "description".
          // For these fields if a prefill value exists for its 'pretty' name, we use the pretty name over
          // the custom id
          if (customField.id !== createKeyID(customField.originalId)) {
            if (fieldsToUpdate[customField.id]) {
              return
            }
          }

          form.change(customField.id, fieldsToUpdate[key])
          return
        }

        form.change(createKeyID(key), fieldsToUpdate[key])
      })
    })
  }, [form, formId, locale, formFields, specificFormFields, prefill])

  useOnChange('supportFields', `support-${formId}`, overwriteFormWithProvidedValues)
  useOnChange('supportCustomFormFields', `support-${formId}`, overwriteFormWithProvidedValues)
  useOnChange('prefill', `support-${formId}`, overwriteFormWithProvidedValues)
  useEffect(overwriteFormWithProvidedValues, [locale])
}

export default useWidgetFormApis
