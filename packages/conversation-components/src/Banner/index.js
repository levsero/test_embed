import React from 'react'
import PropTypes from 'prop-types'
import { BANNER_STATUS } from '../constants'
import { Container, Label } from './styles'

const Banner = ({ message, status }) => {
  return (
    <Container status={status}>
      <Label>{message}</Label>
    </Container>
  )
}

Banner.propTypes = {
  message: PropTypes.string.isRequired,
  status: PropTypes.oneOf(Object.values(BANNER_STATUS))
}

export default Banner
