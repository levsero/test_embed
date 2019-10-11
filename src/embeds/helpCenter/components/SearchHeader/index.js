import React from 'react'
import PropTypes from 'prop-types'
import { locals as styles } from './styles.scss'
import SearchForm from 'src/embeds/helpCenter/components/SearchForm'
import { TEST_IDS } from 'src/constants/shared'
import { Header, HeaderRow } from 'components/Widget'

const SearchHeader = React.forwardRef(({ children }, ref) => {
  return (
    <Header title={children}>
      <HeaderRow>
        <div className={styles.form} data-testid={TEST_IDS.HEADER_CONTAINER}>
          <SearchForm ref={ref} />
        </div>
      </HeaderRow>
    </Header>
  )
})

SearchHeader.propTypes = {
  children: PropTypes.string
}

export default SearchHeader
