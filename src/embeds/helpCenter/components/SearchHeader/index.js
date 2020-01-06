import React from 'react'
import PropTypes from 'prop-types'
import { locals as styles } from './styles.scss'
import SearchForm from 'src/embeds/helpCenter/components/SearchForm'
import { TEST_IDS } from 'src/constants/shared'
import { Header, HeaderRow } from 'components/Widget'

const SearchHeader = ({ title, inputRef }) => {
  return (
    <Header title={title}>
      <HeaderRow>
        <div className={styles.form} data-testid={TEST_IDS.HEADER_CONTAINER}>
          <SearchForm inputRef={inputRef} />
        </div>
      </HeaderRow>
    </Header>
  )
}

SearchHeader.propTypes = {
  title: PropTypes.string.isRequired,
  inputRef: PropTypes.object
}

export default SearchHeader
