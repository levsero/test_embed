import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@zendeskgarden/react-buttons'
import { ButtonGroup } from 'component/button/ButtonGroup'
import { LoadingEllipses } from 'component/loading/LoadingEllipses'
import { locals as styles } from './index.scss'
import classNames from 'classnames'

const HelpCenterChannelButton = ({ buttonLabel, isRTL, onClick, loading, isMobile }) => {
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

HelpCenterChannelButton.propTypes = {
  buttonLabel: PropTypes.string,
  isRTL: PropTypes.bool,
  loading: PropTypes.bool,
  onClick: PropTypes.func,
  isMobile: PropTypes.bool
}

HelpCenterChannelButton.defaultProps = {
  buttonLabel: '',
  isRTL: false,
  loading: false,
  onClick: () => {},
  isMobile: false
}

export default HelpCenterChannelButton
