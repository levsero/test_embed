import React from 'react'
import PropTypes from 'prop-types'
import Transition from 'react-transition-group/Transition'
import useTranslate from 'src/hooks/useTranslate'
import { Container, Text } from './styles'

const LoadingMessagesIndicator = ({ loading }) => {
  const t = useTranslate()
  const transitionStyles = {
    entering: { opacity: 0.9 },
    entered: { opacity: 1 }
  }

  return (
    <Container>
      <Transition timeout={0} in={loading} unmountOnExit={true}>
        {state => (
          <Text style={{ ...transitionStyles[state] }}>
            {t('embeddable_framework.chat.fetching_history')}
          </Text>
        )}
      </Transition>
    </Container>
  )
}

LoadingMessagesIndicator.propTypes = {
  loading: PropTypes.bool
}

export default LoadingMessagesIndicator
