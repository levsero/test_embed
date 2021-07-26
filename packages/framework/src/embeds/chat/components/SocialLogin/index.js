import PropTypes from 'prop-types'
import { TEST_IDS } from 'src/constants/shared'
import useTranslate from 'src/hooks/useTranslate'
import { SocialLoginContainer, LoginIconButton, FacebookLoginIcon, GoogleLoginIcon } from './styles'

const SocialLogin = ({ authUrls = {}, shouldSpace = false }) => {
  const translate = useTranslate()

  if (Object.values(authUrls).length === 0) {
    return null
  }

  return (
    <SocialLoginContainer shouldSpace={shouldSpace}>
      <p>{translate('embeddable_framework.chat.form.common.field.social_login.label')}</p>
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
  authUrls: PropTypes.shape({
    google: PropTypes.string,
    facebook: PropTypes.string,
  }),
  shouldSpace: PropTypes.bool,
}

export default SocialLogin
