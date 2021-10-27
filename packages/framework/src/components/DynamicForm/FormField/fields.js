import AttachmentField from 'src/embeds/support/components/AttachmentField'
import Checkbox from './Checkbox'
import Decimal from './Decimal'
import Dropdown from './Dropdown'
import FallbackField from './FallbackField'
import Integer from './Integer'
import Text from './Text'
import Textarea from './Textarea'

// Each field will be provided these props
// value - The value of your field, this can be any type you want
// onChange - A func to call to update the value
// errorMessage - An error message to display to the user, this will be null when there are no current errors
// field - The field object retrieved from the server
export const supportedFields = {
  text: Text,
  subject: Text,
  textarea: Textarea,
  description: Textarea,
  integer: Integer,
  number: Integer,
  decimal: Decimal,
  checkbox: Checkbox,
  dropdown: Dropdown,
  select: Dropdown,
  tagger: Dropdown,
  attachments: AttachmentField,
  email: Text,
}

const getField = (type, extraFieldOptions = {}) => {
  const options = {
    ...supportedFields,
    ...extraFieldOptions,
  }
  return options[type] || FallbackField
}

export default getField
