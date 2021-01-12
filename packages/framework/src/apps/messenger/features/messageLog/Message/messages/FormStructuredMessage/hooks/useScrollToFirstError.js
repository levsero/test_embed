import { FORM_ERROR } from 'final-form'
import { useCurrentFrame } from 'src/framework/components/Frame'

// useScrollToFirstError returns a function that will scroll to the first field that has errored,
// or to the submit error message if that is the only error to display
const useScrollToFirstError = () => {
  const frame = useCurrentFrame()

  // scrollToFirstErroredField will scroll to the first field that has errored
  return (fields, errors) => {
    const firstFieldToError = fields.concat({ id: FORM_ERROR }).find(field => errors[field._id])
    if (!firstFieldToError) {
      return
    }
    let input = frame.document.querySelector(`[data-id="${firstFieldToError._id}"]`)
    if (input) {
      input.focus()
    }

    const label = frame.document.querySelector(`[data-label-id="${firstFieldToError._id}"]`)

    if (label) {
      label.scrollIntoView()
    }
  }
}

export default useScrollToFirstError
