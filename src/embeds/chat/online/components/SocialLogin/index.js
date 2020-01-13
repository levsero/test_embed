import React from 'react'
import PropTypes from 'prop-types'
import { SocialLoginContainer, LoginIconButton, FacebookLoginIcon, GoogleLoginIcon } from './styles'
import { useTranslate } from 'src/hooks/useTranslation'
import { TEST_IDS } from 'src/constants/shared'

const SocialLogin = ({ authUrls = {} }) => {
  const translate = useTranslate()

  if (Object.values(authUrls).length === 0) {
    return null
  }

  return (
    <SocialLoginContainer>
      {translate('embeddable_framework.chat.form.common.field.social_login.label')}

      {authUrls.facebook && (
        <LoginIconButton
          title="facebook"
          onClick={() => window.open(authUrls.facebook)}
          ignoreThemeOverride={true}
        >
          <FacebookLoginIcon data-testid={TEST_IDS.ICON_FACEBOOK} />
        </LoginIconButton>
      )}

      {authUrls.google && (
        <LoginIconButton
          title="google"
          onClick={() => window.open(authUrls.google)}
          ignoreThemeOverride={true}
        >
          <GoogleLoginIcon data-testid={TEST_IDS.ICON_GOOGLE} />
        </LoginIconButton>
      )}
    </SocialLoginContainer>
  )
}

SocialLogin.propTypes = {
  authUrls: PropTypes.object
}

export default SocialLogin
