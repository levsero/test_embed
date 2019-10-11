import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getSettingsHelpCenterSearchPlaceholder } from 'src/redux/modules/selectors'
import { getSearchLoading, getSearchFieldValue } from 'embeds/helpCenter/selectors'
import SearchField from 'embeds/helpCenter/components/SearchField'
import { performSearch, handleSearchFieldChange } from 'embeds/helpCenter/actions'
import { isMobileBrowser } from 'utility/devices'
import { TEST_IDS } from 'src/constants/shared'
import { Form } from './styles'

const useSearchForm = (callback, handleOnChangeValue) => {
  const [searchValue, setSearchValue] = useState('')
  const handleSubmit = e => {
    e.preventDefault()
    if (searchValue) {
      callback(searchValue)
    }
  }

  return {
    handleOnChange: text => {
      setSearchValue(text)
      handleOnChangeValue(text)
    },
    handleSubmit
  }
}

const SearchForm = React.forwardRef(
  ({ performSearch, isLoading, searchPlaceholder, handleSearchFieldChange, value }, ref) => {
    const { handleOnChange, handleSubmit } = useSearchForm(performSearch, handleSearchFieldChange)

    return (
      <Form noValidate={true} onSubmit={handleSubmit}>
        <SearchField
          ref={ref}
          value={value}
          onChangeValue={handleOnChange}
          isLoading={isLoading}
          searchPlaceholder={searchPlaceholder}
          data-testid={TEST_IDS.SEARCH_FIELD}
        />
      </Form>
    )
  }
)

SearchForm.propTypes = {
  performSearch: PropTypes.func.isRequired,
  searchPlaceholder: PropTypes.string,
  isLoading: PropTypes.bool,
  handleSearchFieldChange: PropTypes.func,
  value: PropTypes.string
}

SearchForm.defaultProps = {
  searchPlaceholder: '',
  isLoading: false,
  isMobile: false,
  value: ''
}

const mapStateToProps = state => {
  return {
    value: getSearchFieldValue(state),
    searchPlaceholder: getSettingsHelpCenterSearchPlaceholder(state),
    isLoading: getSearchLoading(state),
    isMobile: isMobileBrowser()
  }
}

const mapDispatchToProps = {
  performSearch,
  handleSearchFieldChange
}

const connectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { forwardRef: true }
)(SearchForm)

export { connectedComponent as default, SearchForm as Component }
