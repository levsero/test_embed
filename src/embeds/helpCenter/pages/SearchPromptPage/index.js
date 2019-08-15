import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import WidgetContainer from 'src/components/WidgetContainer'
import WidgetHeader from 'src/components/WidgetHeader'
import WidgetMain from 'src/components/WidgetMain'
import WidgetFooter from 'src/components/WidgetFooter'
import ZendeskLogo from 'src/components/ZendeskLogo'
import { SearchField } from 'src/component/field/SearchField'
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

const SearchPromptPage = props => {
  const searchFieldElem = useRef(null)

  useEffect(() => {
    searchFieldElem.current.focus()
  }, [searchFieldElem])
  const { makeSearchRequest, title, isLoading, searchPlaceholder } = props
  const { setSearchValue, handleSubmit } = useSearchForm(makeSearchRequest)

  return (
    <WidgetContainer>
      <WidgetHeader>{title}</WidgetHeader>
      <WidgetMain>
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
      </WidgetMain>
      <WidgetFooter>
        <div className={styles.footer}>
          <ZendeskLogo />
        </div>
      </WidgetFooter>
    </WidgetContainer>
  )
}

SearchPromptPage.propTypes = {
  title: PropTypes.string.isRequired,
  makeSearchRequest: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  searchPlaceholder: PropTypes.string.isRequired
}

export default SearchPromptPage
