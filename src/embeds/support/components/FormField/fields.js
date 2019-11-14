import Text from 'embeds/support/components/FormField/Text'
import Textarea from 'embeds/support/components/FormField/Textarea'
import Integer from 'embeds/support/components/FormField/Integer'
import Decimal from 'embeds/support/components/FormField/Decimal'
import Checkbox from 'embeds/support/components/FormField/Checkbox'
import Dropdown from 'embeds/support/components/FormField/Dropdown'
import LegacyDropdown from 'embeds/support/components/FormField/Dropdown/LegacyDropdown'
import FallbackField from 'embeds/support/components/FormField/FallbackField'

// Each field will be provided these props
// value - The value of your field, this can be any type you want
// onChange - A func to call to update the value
// errorMessage - An error message to display to the user, this will be null when there are no current errors
// field - The field object retrieved from the server
const supportedFields = {
  text: Text,
  textarea: Textarea,
  integer: Integer,
  decimal: Decimal,
  checkbox: Checkbox,
  dropdown: Dropdown,
  tagger: Dropdown,
  legacyDropdown: LegacyDropdown
}

const getField = type => {
  return supportedFields[type] || FallbackField
}

export default getField
