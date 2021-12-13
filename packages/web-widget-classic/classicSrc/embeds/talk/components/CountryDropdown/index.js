import PropTypes from 'prop-types'
import { Dropdown, Field } from '@zendeskgarden/react-dropdowns'
import { useCurrentFrame } from '@zendesk/widget-shared-services/Frame'
import useIsRTL from 'classicSrc/app/webWidget/hooks/useIsRTL'
import { FONT_SIZE, TEST_IDS } from 'classicSrc/constants/shared'
import Flag from 'classicSrc/embeds/talk/components/Flag'
import { Item, Menu, Select, CountryData } from './styles'

const CountryDropdown = ({ selectedKey, onChange, countries, width, isOpen, onToggleOpen }) => {
  const frame = useCurrentFrame()
  const isRtl = useIsRTL()

  return (
    <Dropdown
      isOpen={isOpen}
      onSelect={(value) => onChange(value)}
      onStateChange={({ isOpen }) => {
        if (isOpen === undefined) {
          return
        }
        onToggleOpen(isOpen)
      }}
      downshiftProps={{
        environment: frame.window,
      }}
    >
      <Field>
        <Select data-testid={TEST_IDS.DROPDOWN_FIELD}>
          <Flag country={selectedKey} />
        </Select>
      </Field>
      <Menu
        style={{
          minWidth: width,
          maxWidth: width,
          maxHeight: `${215 / FONT_SIZE}rem`,
          overflow: 'auto',
        }}
        data-testid={TEST_IDS.DROPDOWN_OPTIONS}
      >
        {countries.map(({ name, iso, code }) => {
          return (
            <Item key={iso} value={iso}>
              <Flag country={iso} />
              <CountryData rtl={isRtl}>{`${name} (${code})`}</CountryData>
            </Item>
          )
        })}
      </Menu>
    </Dropdown>
  )
}

CountryDropdown.propTypes = {
  selectedKey: PropTypes.string,
  countries: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      iso: PropTypes.string,
      code: PropTypes.string,
    })
  ),
  onChange: PropTypes.func,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isOpen: PropTypes.bool,
  onToggleOpen: PropTypes.func,
}

CountryDropdown.defaultProps = {
  selectedKey: '',
  countries: [],
  onChange: () => undefined,
}

export default CountryDropdown
