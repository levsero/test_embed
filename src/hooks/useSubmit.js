import { getParsedValues } from 'src/embeds/support/utils/fieldConversion'
import _ from 'lodash'

const useSubmit = (submitForm, validate, setShowFormErrors, mappedTicketFields) => {
  return async (values, _form, callback) => {
    const errors = validate(values, true)
    const parsedValues = getParsedValues(values, mappedTicketFields)

    if (_.isEmpty(errors)) {
      submitForm(parsedValues)
      callback(true)
    } else {
      setShowFormErrors(true)
      callback(false)
    }
  }
}

export { useSubmit }
