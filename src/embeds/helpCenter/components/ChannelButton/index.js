import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Button } from '@zendeskgarden/react-buttons'
import { ButtonGroup } from 'component/button/ButtonGroup'
import { LoadingEllipses } from 'component/loading/LoadingEllipses'
import { locals as styles } from './index.scss'
import classNames from 'classnames'
import { isMobileBrowser } from 'utility/devices'
import { getHelpCenterButtonLabel, getChatConnectionConnecting } from 'src/redux/modules/selectors'
import { i18n } from 'service/i18n'

const ChannelButton = ({ buttonLabel, isRTL, onClick, loading, isMobile }) => {
  const container = classNames(
    styles.container,
    isMobile ? styles.containerMobile : styles.containerDesktop
  )

  const buttonStyles = classNames(styles.button, {
    [styles.disabledButton]: loading
  })

  return (
    <div className={container}>
      <ButtonGroup rtl={isRTL} containerClasses={styles.buttonGroup}>
        <Button primary={true} className={buttonStyles} onClick={!loading ? onClick : null}>
          {loading ? (
            <LoadingEllipses useUserColor={false} itemClassName={styles.loadingAnimation} />
          ) : (
            buttonLabel
          )}
        </Button>
      </ButtonGroup>
    </div>
  )
}

ChannelButton.propTypes = {
  buttonLabel: PropTypes.string,
  isRTL: PropTypes.bool,
  loading: PropTypes.bool,
  onClick: PropTypes.func,
  isMobile: PropTypes.bool
}

ChannelButton.defaultProps = {
  buttonLabel: '',
  isRTL: false,
  loading: false,
  onClick: () => {},
  isMobile: false
}

const mapStateToProps = state => {
  return {
    isMobile: isMobileBrowser(),
    buttonLabel: getHelpCenterButtonLabel(state),
    isRTL: i18n.isRTL(),
    loading: getChatConnectionConnecting(state)
  }
}

const connectedComponent = connect(mapStateToProps)(ChannelButton)

export { connectedComponent as default, ChannelButton as Component }
