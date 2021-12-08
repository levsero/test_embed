import { Footer } from 'classicSrc/components/Widget'
import ChannelButton from 'classicSrc/embeds/helpCenter/components/ChannelButton'
import PropTypes from 'prop-types'

const HelpCenterFooter = ({ showNextButton, onClick }) => {
  return <Footer>{showNextButton && <ChannelButton onClick={onClick} />}</Footer>
}

HelpCenterFooter.propTypes = {
  onClick: PropTypes.func,
  showNextButton: PropTypes.bool,
}

export default HelpCenterFooter
