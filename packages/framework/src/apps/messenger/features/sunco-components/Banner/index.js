import React from 'react'
import PropTypes from 'prop-types'
import { Container, Label } from './styles'
import { BANNER_STATUS } from 'src/apps/messenger/features/sunco-components/constants'

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
