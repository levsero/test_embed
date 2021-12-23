import { TEST_IDS } from 'classicSrc/constants/shared'
import { performSearch, handleSearchFieldChange } from 'classicSrc/embeds/helpCenter/actions'
import SearchField from 'classicSrc/embeds/helpCenter/components/SearchField'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { connect } from 'react-redux'
import { Form } from './styles'

const useSearchForm = (callback, handleOnChangeValue) => {
  const [searchValue, setSearchValue] = useState('')
  const handleSubmit = (e) => {
    e.preventDefault()
    if (searchValue) {
      callback(searchValue)
    }
  }

  return {
    handleOnChange: (text) => {
      setSearchValue(text)
      handleOnChangeValue(text)
    },
    handleSubmit,
  }
}

const SearchForm = ({ performSearch, handleSearchFieldChange, inputRef }) => {
  const { handleOnChange, handleSubmit } = useSearchForm(performSearch, handleSearchFieldChange)

  return (
    <Form noValidate={true} onSubmit={handleSubmit}>
      <SearchField
        inputRef={inputRef}
        onChange={handleOnChange}
        data-testid={TEST_IDS.SEARCH_FIELD}
      />
    </Form>
  )
}

SearchForm.propTypes = {
  performSearch: PropTypes.func.isRequired,
  handleSearchFieldChange: PropTypes.func,
  inputRef: PropTypes.object,
}

const mapDispatchToProps = {
  performSearch,
  handleSearchFieldChange,
}

const connectedComponent = connect(null, mapDispatchToProps)(SearchForm)

export { connectedComponent as default, SearchForm as Component }
