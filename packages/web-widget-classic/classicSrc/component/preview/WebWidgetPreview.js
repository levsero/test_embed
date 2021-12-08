import { i18n } from 'classicSrc/app/webWidget/services/i18n'
import Chat from 'classicSrc/component/chat/Chat'
import { Container } from 'classicSrc/component/container/Container'
import PropTypes from 'prop-types'
import { Component } from 'react'

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
