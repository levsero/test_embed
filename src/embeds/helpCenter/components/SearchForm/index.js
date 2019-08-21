import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { SearchField } from 'src/component/field/SearchField'
import { getSettingsHelpCenterSearchPlaceholder } from 'src/redux/modules/selectors'
import { getSearchLoading } from 'embeds/helpCenter/selectors'
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

const SearchForm = ({
  performSearch,
  isLoading,
  searchPlaceholder,
  isMobile,
  handleSearchFieldChange
}) => {
  const searchFieldElem = useRef(null)
  useEffect(() => {
    searchFieldElem.current.focus()
  }, [])
  const { handleOnChange, handleSubmit } = useSearchForm(performSearch, handleSearchFieldChange)

  return (
    <form noValidate={true} onSubmit={handleSubmit} className={styles.form}>
      <SearchField
        ref={searchFieldElem}
        fullscreen={isMobile}
        onChangeValue={handleOnChange}
        onSearchIconClick={handleSubmit}
        isLoading={isLoading}
        searchPlaceholder={searchPlaceholder}
      />
    </form>
  )
}

SearchForm.propTypes = {
  performSearch: PropTypes.func.isRequired,
  searchPlaceholder: PropTypes.string,
  isLoading: PropTypes.bool,
  isMobile: PropTypes.bool,
  handleSearchFieldChange: PropTypes.func
}

SearchForm.defaultProps = {
  searchPlaceholder: '',
  isLoading: false,
  isMobile: false
}

const mapStateToProps = state => {
  return {
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
  mapDispatchToProps
)(SearchForm)

export { connectedComponent as default, SearchForm as Component }
