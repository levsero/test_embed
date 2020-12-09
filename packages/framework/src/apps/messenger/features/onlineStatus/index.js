import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { CSSTransition } from 'react-transition-group'
import { Banner } from '@zendesk/conversation-components'

import { BANNER_STATUS } from 'src/apps/messenger/features/sunco-components/constants'
import { getIsOnline } from './store'
import { Container } from './styles'

const OfflineBanner = () => (
  <Banner message="Offline. You will not receive messages." status={BANNER_STATUS.fatal} />
)

const ReconnectedBanner = ({ onExit }) => {
  const [isVisible, setIsVisible] = useState(true)

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
          <Banner message="You're back online!" status={BANNER_STATUS.success} />
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
