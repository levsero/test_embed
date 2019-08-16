import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import WidgetContainer from 'src/components/WidgetContainer'
import WidgetHeader from 'src/components/WidgetHeader'
import WidgetMain from 'src/components/WidgetMain'
import WidgetFooter from 'src/components/WidgetFooter'
import ZendeskLogo from 'src/components/ZendeskLogo'
import { SearchField } from 'src/component/field/SearchField'
import { locals as styles } from './styles.scss'
import { getSearchLoading } from 'embeds/helpCenter/selectors'
import {
  getSettingsHelpCenterSearchPlaceholder,
  getSettingsHelpCenterTitle
} from 'src/redux/modules/selectors'
import { performSearch } from 'embeds/helpCenter/actions'

const useSearchForm = performSearch => {
  const [searchValue, setSearchValue] = useState('')
  const handleSubmit = e => {
    e.preventDefault()
    if (searchValue) {
      performSearch(searchValue)
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
  const { performSearch, title, searchLoading, searchPlaceholder } = props
  const { setSearchValue, handleSubmit } = useSearchForm(performSearch)

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
            isLoading={searchLoading}
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
  performSearch: PropTypes.func.isRequired,
  searchLoading: PropTypes.bool.isRequired,
  searchPlaceholder: PropTypes.string.isRequired
}

const mapStateToProps = state => {
  return {
    searchLoading: getSearchLoading(state),
    searchPlaceholder: getSettingsHelpCenterSearchPlaceholder(state),
    title: getSettingsHelpCenterTitle(state)
  }
}

const mapDispatchToProps = {
  performSearch
}

const connectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchPromptPage)

export { connectedComponent as default, SearchPromptPage as Component }
