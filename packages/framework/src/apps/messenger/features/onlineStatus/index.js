import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { CSSTransition } from 'react-transition-group'
import { Banner, BANNER_STATUS } from '@zendesk/conversation-components'
import useTranslate from 'src/apps/messenger/features/i18n/useTranslate'

import { getIsOnline } from './store'
import { Container } from './styles'

const OfflineBanner = () => {
  const translate = useTranslate()
  return (
    <Banner
      message={translate('embeddable_framework.messenger.connection_status.offline')}
      status={BANNER_STATUS.fatal}
    />
  )
}

const ReconnectedBanner = ({ onExit }) => {
  const [isVisible, setIsVisible] = useState(true)
  const translate = useTranslate()

  useEffect(() => {
    setIsVisible(false)
  }, [])

  const duration = 3000

  const defaultStyle = {
    transition: `opacity ${duration}ms ease-in-out`,
    zIndex: 10,
    opacity: 1
  }

  const transitionStyles = {
    exiting: { opacity: 0 },
    exited: { opacity: 0 }
  }

  return (
    <CSSTransition in={isVisible} timeout={duration} onExited={onExit}>
      {state => (
        <div
          style={{
            ...defaultStyle,
            ...transitionStyles[state]
          }}
        >
          <Banner
            message={translate('embeddable_framework.messenger.connection_status.now_online')}
            status={BANNER_STATUS.success}
          />
        </div>
      )}
    </CSSTransition>
  )
}

ReconnectedBanner.propTypes = {
  onExit: PropTypes.func
}

const OnlineStatusBanner = () => {
  const isOnline = useSelector(getIsOnline)
  const [showReconnectedBanner, setShowReconnectedBanner] = useState(false)

  if (!showReconnectedBanner && !isOnline) {
    setShowReconnectedBanner(true)
  }

  return (
    <Container>
      {isOnline ? (
        showReconnectedBanner && (
          <ReconnectedBanner onExit={() => setShowReconnectedBanner(false)} />
        )
      ) : (
        <OfflineBanner />
      )}
    </Container>
  )
}

export default OnlineStatusBanner
