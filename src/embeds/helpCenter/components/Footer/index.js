import React from 'react'
import PropTypes from 'prop-types'
import WidgetFooter from 'src/components/WidgetFooter'
import ZendeskLogo from 'src/components/ZendeskLogo'
import ChannelButton from 'src/embeds/helpCenter/components/ChannelButton'
import { Container } from './styles'

const Footer = ({ showNextButton, hideZendeskLogo, isMobile, onClick }) => {
  const zendeskLogoHidden = !hideZendeskLogo && !isMobile

  return (
    <WidgetFooter scrollShadowVisible={showNextButton}>
      <Container hideZendeskLogo={zendeskLogoHidden}>
        {zendeskLogoHidden && <ZendeskLogo />}
        {showNextButton && <ChannelButton onClick={onClick} />}
      </Container>
    </WidgetFooter>
  )
}

Footer.propTypes = {
  isMobile: PropTypes.bool,
  hideZendeskLogo: PropTypes.bool,
  onClick: PropTypes.func,
  showNextButton: PropTypes.bool
}

export default Footer
