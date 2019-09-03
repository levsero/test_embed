import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getSettingsHelpCenterSearchPlaceholder } from 'src/redux/modules/selectors'
import { getSearchLoading, getSearchFieldValue } from 'embeds/helpCenter/selectors'
import SearchField from 'embeds/helpCenter/components/SearchField'
import { performSearch, handleSearchFieldChange } from 'embeds/helpCenter/actions'
import { isMobileBrowser } from 'utility/devices'

import { locals as styles } from './styles.scss'

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
  (
    { performSearch, isLoading, searchPlaceholder, isMobile, handleSearchFieldChange, value },
    ref
  ) => {
    const { handleOnChange, handleSubmit } = useSearchForm(performSearch, handleSearchFieldChange)

    return (
      <form noValidate={true} onSubmit={handleSubmit} className={styles.form}>
        <SearchField
          ref={ref}
          value={value}
          isMobile={isMobile}
          onChangeValue={handleOnChange}
          onSearchIconClick={handleSubmit}
          isLoading={isLoading}
          searchPlaceholder={searchPlaceholder}
        />
      </form>
    )
  }
)

SearchForm.propTypes = {
  performSearch: PropTypes.func.isRequired,
  searchPlaceholder: PropTypes.string,
  isLoading: PropTypes.bool,
  isMobile: PropTypes.bool,
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
