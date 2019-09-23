import React from 'react'
import PropTypes from 'prop-types'
import { locals as styles } from './styles.scss'
import WidgetFooter from 'src/components/WidgetFooter'
import ZendeskLogo from 'src/components/ZendeskLogo'
import ChannelButton from 'src/embeds/helpCenter/components/ChannelButton'

const Footer = ({ showNextButton, hideZendeskLogo, isMobile, onClick }) => {
  return (
    <WidgetFooter scrollShadowVisible={showNextButton}>
      <div className={!hideZendeskLogo && !isMobile ? styles.footerContentMultiple : null}>
        {!hideZendeskLogo && !isMobile && <ZendeskLogo />}
        {showNextButton && <ChannelButton onClick={onClick} />}
      </div>
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
