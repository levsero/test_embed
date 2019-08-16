import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { SearchField } from 'src/component/field/SearchField'
import { getSettingsHelpCenterSearchPlaceholder } from 'src/redux/modules/selectors'
import { getSearchLoading } from 'embeds/helpCenter/selectors'
import { performSearch } from 'embeds/helpCenter/actions'

import { locals as styles } from './styles.scss'

const useSearchForm = callback => {
  const [searchValue, setSearchValue] = useState('')
  const handleSubmit = e => {
    e.preventDefault()
    if (searchValue) {
      callback(searchValue)
    }
  }

  return {
    setSearchValue,
    handleSubmit
  }
}

const SearchForm = props => {
  const { performSearch, isLoading, searchPlaceholder } = props

  const searchFieldElem = useRef(null)
  useEffect(() => {
    searchFieldElem.current.focus()
  }, [])
  const { setSearchValue, handleSubmit } = useSearchForm(performSearch)

  return (
    <form noValidate={true} onSubmit={handleSubmit} className={styles.form}>
      <SearchField
        ref={searchFieldElem}
        fullscreen={false}
        onChangeValue={setSearchValue}
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
  isLoading: PropTypes.bool
}

SearchForm.defaultProps = {
  searchPlaceholder: '',
  isLoading: false
}

const mapStateToProps = state => {
  return {
    searchPlaceholder: getSettingsHelpCenterSearchPlaceholder(state),
    isLoading: getSearchLoading(state)
  }
}

const mapDispatchToProps = {
  performSearch
}

const connectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchForm)

export { connectedComponent as default, SearchForm as Component }
