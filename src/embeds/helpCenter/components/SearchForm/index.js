import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { SearchField } from 'src/component/field/SearchField'
import { getSettingsHelpCenterSearchPlaceholder } from 'src/redux/modules/selectors'
import { getSearchLoading, getArticles } from 'embeds/helpCenter/selectors'
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
  handleSearchFieldChange,
  articles
}) => {
  const searchFieldElem = useRef(null)
  useEffect(() => {
    if (articles.length === 0) searchFieldElem.current.focus()
  }, [articles])
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
  handleSearchFieldChange: PropTypes.func,
  articles: PropTypes.array
}

SearchForm.defaultProps = {
  searchPlaceholder: '',
  isLoading: false,
  isMobile: false,
  articles: []
}

const mapStateToProps = state => {
  return {
    searchPlaceholder: getSettingsHelpCenterSearchPlaceholder(state),
    isLoading: getSearchLoading(state),
    isMobile: isMobileBrowser(),
    articles: getArticles(state)
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
