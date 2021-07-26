import PropTypes from 'prop-types'
import { Component } from 'react'
import { i18n } from 'src/apps/webWidget/services/i18n'
import Chat from 'src/component/chat/Chat'
import { Container } from 'src/component/container/Container'

const noop = () => {}

export class WebWidgetPreview extends Component {
  static propTypes = {
    containerStyle: PropTypes.shape({
      margin: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      width: PropTypes.string,
    }),
  }

  render() {
    return (
      <Container style={this.props.containerStyle}>
        <Chat locale={i18n.getLocale()} updateChatBackButtonVisibility={noop} isPreview={true} />
      </Container>
    )
  }
}
