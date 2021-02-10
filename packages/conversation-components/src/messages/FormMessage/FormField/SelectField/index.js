import { useEffect, useRef, useState, useContext } from 'react'
import PropTypes from 'prop-types'
import { ThemeContext } from 'styled-components'
import { Field, Message as GardenDropdownMessage } from '@zendeskgarden/react-dropdowns'
import Message from 'src/messages/FormMessage/FormField/Message'
import { restoreHostPageScrollPositionIfSafari } from 'src/utils/hostPageWindow'
import { Container, Dropdown, Select, Item, Label, Menu } from './styles'

const SelectField = ({ field, value, onChange, error, lastSubmittedTimestamp }) => {
  const {
    messenger: { currentFrame }
  } = useContext(ThemeContext)
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    restoreHostPageScrollPositionIfSafari(() => {
      inputRef.current?.focus()
    })

    // Default to the first option if none already selected
    if (!value) {
      onChange([field.options[0]])
    }
  }, [])

  return (
    <Container
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
          environment: currentFrame?.window,
          itemToString: item => item?.label
        }}
        name={field.name}
        data-id={field._id}
      >
        <Field>
          <Label data-label-id={field._id}>{field.label}</Label>
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
    </Container>
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
