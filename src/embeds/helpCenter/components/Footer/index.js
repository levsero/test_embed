import React from 'react'
import PropTypes from 'prop-types'
import Footer from 'src/components/Widget/Footer'
import ZendeskLogo from 'src/components/ZendeskLogo'
import ChannelButton from 'src/embeds/helpCenter/components/ChannelButton'
import { Container } from './styles'

const HelpCenterFooter = ({ showNextButton, hideZendeskLogo, isMobile, onClick }) => {
  const zendeskLogoHidden = !hideZendeskLogo && !isMobile

  return (
    <Footer scrollShadowVisible={showNextButton}>
      <Container hideZendeskLogo={zendeskLogoHidden}>
        {zendeskLogoHidden && <ZendeskLogo />}
        {showNextButton && <ChannelButton onClick={onClick} />}
      </Container>
    </Footer>
  )
}

HelpCenterFooter.propTypes = {
  isMobile: PropTypes.bool,
  hideZendeskLogo: PropTypes.bool,
  onClick: PropTypes.func,
  showNextButton: PropTypes.bool
}

export default HelpCenterFooter
