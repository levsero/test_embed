import { TEST_IDS } from 'classicSrc/constants/shared'
import SearchFieldEndIcon from 'classicSrc/embeds/helpCenter/components/SearchFieldEndIcon'
import { getSearchLoading, getSearchFieldValue } from 'classicSrc/embeds/helpCenter/selectors'
import { getSettingsHelpCenterSearchPlaceholder } from 'classicSrc/redux/modules/selectors'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Field, MediaInput } from '@zendeskgarden/react-forms'
import { SearchIcon } from './styles'

const handleSearchFieldCleared = (onChange, inputRef) => () => {
  onChange()
  inputRef.current.focus()
}

const SearchField = ({ isLoading, onChange, placeholder, value, inputRef }) => {
  return (
    <Field>
      <MediaInput
        start={
          <SearchIcon
            data-testid={TEST_IDS.ICON_SEARCH}
            role="presentation"
            aria-hidden="true"
            focusable="false"
          />
        }
        end={
          <SearchFieldEndIcon
            isLoading={isLoading}
            isVisible={!!value}
            onClick={handleSearchFieldCleared(onChange, inputRef)}
          />
        }
        onChange={(e) => onChange(e.target.value)}
        value={value}
        ref={inputRef}
        placeholder={placeholder}
        data-testid={TEST_IDS.SEARCH_FIELD}
        type="search"
        autoCapitalize="off"
      />
    </Field>
  )
}

SearchField.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  inputRef: PropTypes.object,
}

const mapStateToProps = (state) => ({
  isLoading: getSearchLoading(state),
  placeholder: getSettingsHelpCenterSearchPlaceholder(state),
  value: getSearchFieldValue(state),
})

const connectedComponent = connect(mapStateToProps)(SearchField)

export { connectedComponent as default, SearchField as Component }
