import React from 'react'
import PropTypes from 'prop-types'

import { Button } from './styles'

const ButtonPill = ({ onClick = () => {}, children }) => {
  return (
    <Button onClick={onClick} isPill={true}>
      {children}
    </Button>
  )
}

ButtonPill.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
}

export default ButtonPill
