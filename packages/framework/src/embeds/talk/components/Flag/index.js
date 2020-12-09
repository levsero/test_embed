import React from 'react'
import PropTypes from 'prop-types'
import { FlagIcon } from './styles'

const Flag = ({ country }) => {
  return (
    <FlagIcon
      country={country}
      alt={country}
      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAQMAAABJtOi3AAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAAxJREFUeNpjYBjcAAAAoAABjvuxtAAAAABJRU5ErkJggg=="
    />
  )
}

Flag.propTypes = {
  country: PropTypes.string.isRequired
}

export default Flag
