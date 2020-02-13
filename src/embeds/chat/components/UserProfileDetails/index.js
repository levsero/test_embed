import React from 'react'
import PropTypes from 'prop-types'
import { UserProfileDetailsContainer, DisplayName } from './styles'

const UserProfileDetails = ({ isSociallyAuthenticated, displayName, email }) => {
  return (
    <UserProfileDetailsContainer isSociallyAuthenticated={isSociallyAuthenticated}>
      <DisplayName>{displayName}</DisplayName>
      <div>{email}</div>
    </UserProfileDetailsContainer>
  )
}

UserProfileDetails.propTypes = {
  isSociallyAuthenticated: PropTypes.bool.isRequired,
  displayName: PropTypes.string,
  email: PropTypes.string
}

export default UserProfileDetails
