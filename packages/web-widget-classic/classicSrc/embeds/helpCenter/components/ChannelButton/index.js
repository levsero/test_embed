import { i18n } from 'classicSrc/app/webWidget/services/i18n'
import { ButtonGroup } from 'classicSrc/component/button/ButtonGroup'
import { onHelpCenterNextClick } from 'classicSrc/redux/modules/base'
import {
  getHelpCenterButtonLabel,
  getChatConnectionConnecting,
} from 'classicSrc/redux/modules/selectors'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { ButtonContainer, StyledButton, Loading } from './styles'

const ChannelButton = ({ buttonLabel, isRTL, onClick, loading }) => {
  return (
    <ButtonContainer>
      <ButtonGroup rtl={isRTL}>
        <StyledButton isPrimary={true} onClick={!loading ? onClick : null}>
          {loading ? <Loading color="white" size={24} /> : buttonLabel}
        </StyledButton>
      </ButtonGroup>
    </ButtonContainer>
  )
}

ChannelButton.propTypes = {
  buttonLabel: PropTypes.string,
  isRTL: PropTypes.bool,
  loading: PropTypes.bool,
  onClick: PropTypes.func,
}

ChannelButton.defaultProps = {
  buttonLabel: '',
  isRTL: false,
  loading: false,
}

const mapStateToProps = (state) => {
  return {
    buttonLabel: getHelpCenterButtonLabel(state),
    isRTL: i18n.isRTL(),
    loading: getChatConnectionConnecting(state),
  }
}

const actionCreators = {
  onClick: onHelpCenterNextClick,
}

const connectedComponent = connect(mapStateToProps, actionCreators)(ChannelButton)

export { connectedComponent as default, ChannelButton as Component }
