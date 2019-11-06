import React, { useState } from 'react'
import Dropdown from 'embeds/support/components/FormField/Dropdown/index'

// All field components for FormField expect to be controlled (i.e. be provided value and onChange) props.
// This is the case for all fields, except for the current Dropdown in SubmitTicket. This is because the SubmitTicket
// before the final form migration had its Dropdown use local state
// https://github.com/zendesk/embeddable_framework/blob/32899f9f8526c182314b705af8776e4c6bb1ef32/src/components/NestedDropdown/index.js#L82
// which put the value in an invisible input element
// https://github.com/zendesk/embeddable_framework/blob/32899f9f8526c182314b705af8776e4c6bb1ef32/src/components/NestedDropdown/index.js#L284
// which allowed SubmitTicket to access the fields value.
// Since this goes against the new controlled structured, this component has been created to backport the new FormField
// component to the current SubmitTicket implementation until we migrate it over to the new support embed.
const LegacyDropdown = ({ field, value, errorMessage, onChange }) => {
  const customFieldOptions = field.custom_field_options || []

  const [selectedItem, setSelectedItem] = useState(
    (customFieldOptions.find(option => option.default) || {}).value || value
  )

  return (
    <>
      <Dropdown
        field={field}
        value={selectedItem}
        onChange={item => {
          setSelectedItem(item)
          onChange()
        }}
        errorMessage={errorMessage}
      />
      <input type="hidden" name={field.id} value={selectedItem} />
    </>
  )
}

LegacyDropdown.propTypes = Dropdown.propTypes

export default LegacyDropdown
