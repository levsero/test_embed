import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { ButtonGroup } from 'component/button/ButtonGroup'
import { onHelpCenterNextClick } from 'src/redux/modules/base'
import { getHelpCenterButtonLabel, getChatConnectionConnecting } from 'src/redux/modules/selectors'
import { i18n } from 'service/i18n'
import { ButtonContainer, StyledButton, Loading } from './styles'

const ChannelButton = ({ buttonLabel, isRTL, onClick, loading }) => {
  return (
    <ButtonContainer>
      <ButtonGroup rtl={isRTL}>
        <StyledButton primary={true} onClick={!loading ? onClick : null}>
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
  onClick: PropTypes.func
}

ChannelButton.defaultProps = {
  buttonLabel: '',
  isRTL: false,
  loading: false
}

const mapStateToProps = state => {
  return {
    buttonLabel: getHelpCenterButtonLabel(state),
    isRTL: i18n.isRTL(),
    loading: getChatConnectionConnecting(state)
  }
}

const actionCreators = {
  onClick: onHelpCenterNextClick
}

const connectedComponent = connect(
  mapStateToProps,
  actionCreators
)(ChannelButton)

export { connectedComponent as default, ChannelButton as Component }
