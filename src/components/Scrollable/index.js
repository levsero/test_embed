import React from 'react'
import PropTypes from 'prop-types'

export const Scrollable = ({ style = {}, ...props }) => {
  return (
    <div
      style={{
        overflow: 'auto',
        ...style
      }}
      {...props}
    />
  )
}

Scrollable.propTypes = {
  style: PropTypes.object
}
