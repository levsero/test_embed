import React from 'react'
import PropTypes from 'prop-types'
import { Footer } from 'src/components/Widget'
import ChannelButton from 'src/embeds/helpCenter/components/ChannelButton'

const HelpCenterFooter = ({ showNextButton, onClick }) => {
  return <Footer>{showNextButton && <ChannelButton onClick={onClick} />}</Footer>
}

HelpCenterFooter.propTypes = {
  onClick: PropTypes.func,
  showNextButton: PropTypes.bool,
}

export default HelpCenterFooter
