import React from 'react'
import PropTypes from 'prop-types'

import { locals as styles } from './styles.scss'

const Flag = ({ country }) => {
  const flagClasses = `
      ${styles.flag}
      ${styles.flag}-${country}
      ${styles.flagCustom}
    `
  return (
    <img
      className={flagClasses}
      alt={country}
      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAQMAAABJtOi3AAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAAxJREFUeNpjYBjcAAAAoAABjvuxtAAAAABJRU5ErkJggg=="
    />
  )
}

Flag.propTypes = {
  country: PropTypes.string.isRequired
}

export default Flag
