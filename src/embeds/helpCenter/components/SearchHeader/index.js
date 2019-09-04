import React from 'react'
import PropTypes from 'prop-types'
import { locals as styles } from './styles.scss'
import classNames from 'classnames'
import SearchForm from 'src/embeds/helpCenter/components/SearchForm'
import { TEST_IDS } from 'src/constants/shared'

const SearchHeader = React.forwardRef(({ children, isMobile }, ref) => {
  const headerClasses = classNames(styles.header, {
    [styles.headerMobile]: isMobile
  })

  return (
    <div className={headerClasses} data-testid={TEST_IDS.HEADER_CONTAINER}>
      <h1 className={styles.title}>{children}</h1>
      <div className={styles.form}>
        <SearchForm ref={ref} />
      </div>
    </div>
  )
})

SearchHeader.propTypes = {
  children: PropTypes.string,
  isMobile: PropTypes.bool
}

export default SearchHeader
