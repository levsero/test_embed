import React from 'react'
import PropTypes from 'prop-types'
import UserProfile from 'src/embeds/chat/components/UserProfile'
import { TEST_IDS } from 'constants/shared'

import ContactDetailField from 'src/embeds/chat/components/ContactDetails/Field'

const ChatContactDetailsUserProfile = ({
  authUrls,
  initiateSocialLogout,
  isAuthenticated,
  requiredFormData,
  socialLogin,
  visitor,
}) => {
  const { name: nameData, email: emailData } = requiredFormData
  const nameField = (
    <ContactDetailField
      isAuthenticated={isAuthenticated}
      isRequired={nameData.required}
      name="display_name"
      label={'embeddable_framework.common.textLabel.name'}
      testId={TEST_IDS.NAME_FIELD}
      shouldFocusOnMount={true}
    />
  )

  const emailField = (
    <ContactDetailField
      isAuthenticated={isAuthenticated}
      isRequired={emailData.required}
      name="email"
      label={'embeddable_framework.common.textLabel.email'}
      testId={TEST_IDS.EMAIL_FIELD}
    />
  )

  return (
    <UserProfile
      authUrls={authUrls}
      emailField={emailField}
      initiateSocialLogout={initiateSocialLogout}
      isAuthenticated={isAuthenticated}
      nameField={nameField}
      socialLogin={socialLogin}
      visitor={visitor}
      shouldSpaceSocialLogin={true}
    />
  )
}

ChatContactDetailsUserProfile.propTypes = {
  authUrls: PropTypes.objectOf(PropTypes.string),
  initiateSocialLogout: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  requiredFormData: PropTypes.shape({
    name: PropTypes.shape({
      required: PropTypes.bool,
    }),
    email: PropTypes.shape({
      required: PropTypes.bool,
    }),
  }),
  socialLogin: PropTypes.shape({
    authenticated: PropTypes.bool,
    screen: PropTypes.string,
    avatarPath: PropTypes.string,
  }).isRequired,
  visitor: PropTypes.shape({
    display_name: PropTypes.string,
    email: PropTypes.string,
  }),
}

export default ChatContactDetailsUserProfile
