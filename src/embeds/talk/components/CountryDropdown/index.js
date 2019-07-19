import React from 'react'
import PropTypes from 'prop-types'
import { Item, SelectField, Select } from '@zendeskgarden/react-select'
import styled from 'styled-components'
import { FONT_SIZE } from 'constants/shared'
import { Flag } from 'component/Flag'

const SmallFlag = styled(Flag)`
  height: ${17.5 / FONT_SIZE}rem;
  [dir='ltr'] & {
    margin-right: ${props => props.gap && `${10 / FONT_SIZE}rem`};
  }

  [dir='rtl'] & {
    margin-left: ${props => props.gap && `${10 / FONT_SIZE}rem`};
  }
`

const FlexItem = styled(Item)`
  display: flex !important;
`

const CountryDropdown = ({
  appendToNode,
  selectedKey,
  onChange,
  countries,
  width,
  isOpen,
  onToggleOpen
}) => {
  const dropdownStyle = {
    width,
    maxHeight: `${215 / FONT_SIZE}rem`,
    overflow: 'auto'
  }

  return (
    <SelectField>
      <Select
        isOpen={isOpen}
        onStateChange={({ isOpen }) => {
          if (isOpen === undefined) {
            return
          }
          onToggleOpen(isOpen)
        }}
        dropdownProps={{
          style: dropdownStyle,
          'data-testid': 'countryDropdown--dropdown'
        }}
        onChange={onChange}
        appendToNode={appendToNode}
        data-testid={'countryDropdown--select'}
        options={countries.map(({ name, iso, code }) => {
          return (
            <FlexItem key={iso}>
              <SmallFlag gap={true} country={iso} />
              {`${name} (${code})`}
            </FlexItem>
          )
        })}
      >
        <SmallFlag country={selectedKey} data-testid="countryDropdown--selected" />
      </Select>
    </SelectField>
  )
}

CountryDropdown.propTypes = {
  appendToNode: Select.propTypes.appendToNode,
  selectedKey: PropTypes.string,
  countries: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      iso: PropTypes.string,
      code: PropTypes.string
    })
  ),
  onChange: PropTypes.func,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isOpen: PropTypes.bool,
  onToggleOpen: PropTypes.func
}

CountryDropdown.defaultProps = {
  selectedKey: '',
  countries: [],
  onChange: () => undefined
}

export default CountryDropdown
