import PropTypes from 'prop-types'
import Transition from 'react-transition-group/Transition'
import useLabels from 'src/hooks/useLabels'
import { NOTIFICATION_TYPES } from '../constants'
import { Container, Content, Icon, Label } from './styles'

const Notification = ({ messageType }) => {
  const message = useLabels().notification[messageType]

  return (
    <Transition appear={true} in={true} timeout={0}>
      {(state) => {
        return (
          <Container state={state}>
            <Content>
              <Icon />
              <Label>{message}</Label>
            </Content>
          </Container>
        )
      }}
    </Transition>
  )
}

Notification.propTypes = {
  messageType: PropTypes.oneOf(Object.values(NOTIFICATION_TYPES)),
}

export default Notification
