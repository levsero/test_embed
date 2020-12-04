import React from 'react'
import PropTypes from 'prop-types'

import { Button } from './styles'

const StartCallButton = ({ clickHandler, contents }) => {
  return (
    <Button onClick={clickHandler} isPrimary={true}>
      {contents}
    </Button>
  )
}

StartCallButton.propTypes = { clickHandler: PropTypes.func, contents: PropTypes.element }

export default StartCallButton
