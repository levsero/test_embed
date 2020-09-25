import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Field, Message as GardenDropdownMessage } from '@zendeskgarden/react-dropdowns'
import { useCurrentFrame } from 'src/framework/components/Frame'
import { Dropdown, Select, Item, Label, Menu } from './styles'
import Message from 'src/apps/messenger/features/sunco-components/Form/FormField/Message'

const SelectField = ({ field, value, onChange, error, lastSubmittedTimestamp }) => {
  const frame = useCurrentFrame()
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()

    // Default to the first option if none already selected
    if (!value) {
      onChange([field.options[0]])
    }
  }, [])

  return (
    <div
      role="presentation"
      onKeyDown={e => {
        if (e.key === 'Escape' && isOpen) {
          e.stopPropagation()
        }
      }}
      tabIndex="-1"
    >
      <Dropdown
        isOpen={isOpen}
        onStateChange={dropdownState => {
          if (dropdownState.hasOwnProperty('isOpen')) {
            setIsOpen(dropdownState.isOpen)
          }
        }}
        selectedItem={value}
        onSelect={option => {
          onChange([option])
        }}
        downshiftProps={{
          environment: frame.window,
          itemToString: item => item?.label
        }}
        name={field.name}
      >
        <Field>
          <Label>{field.label}</Label>
          <Select ref={inputRef} isOpen={isOpen} validation={error ? 'error' : undefined}>
            {value?.[0]?.label ?? ''}
          </Select>
        </Field>
        <Menu>
          {field.options.map(option => (
            <Item key={option._id} value={option}>
              {option.label}
            </Item>
          ))}
        </Menu>
        {error && (
          <Message key={lastSubmittedTimestamp} validation="error" as={GardenDropdownMessage}>
            {error}
          </Message>
        )}
      </Dropdown>
    </div>
  )
}

SelectField.propTypes = {
  field: PropTypes.shape({
    label: PropTypes.string,
    name: PropTypes.string,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
        label: PropTypes.string
      })
    )
  }),
  value: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      label: PropTypes.string
    })
  ),
  onChange: PropTypes.func,
  lastSubmittedTimestamp: PropTypes.number,
  error: PropTypes.string
}

export default SelectField
