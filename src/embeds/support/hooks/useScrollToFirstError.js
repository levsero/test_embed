import { FORM_ERROR } from 'final-form'
import { useCurrentFrame } from 'components/Frame'

// useScrollToFirstError returns a function that will scroll to the first field that has errored,
// or to the submit error message if that is the only error to display
const useScrollToFirstError = () => {
  const frame = useCurrentFrame()

  // scrollToFirstErroredField will scroll to the first field that has errored, or to the submit error message if
  // no fields have errors
  return (fields, errors) => {
    const firstFieldToError = fields
      .concat({ keyID: FORM_ERROR })
      .find(field => errors[field.keyID])

    if (!firstFieldToError) {
      return
    }

    const input = frame.document.querySelector(`[name="${firstFieldToError.keyID}"]`)

    if (input) {
      input.focus()
    }

    const label = frame.document.querySelector(`[data-keyid="${firstFieldToError.keyID}"]`)

    if (label) {
      label.scrollIntoView()
    }
  }
}

export default useScrollToFirstError
