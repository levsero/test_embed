import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { connect } from 'react-redux'

import { ButtonCard } from './structuredMessage/ButtonCard'
import { PanelCard } from './structuredMessage/PanelCard'
import { ListCard } from './structuredMessage/ListCard'
import { CHAT_STRUCTURED_CONTENT_TYPE, CHAT_STRUCTURED_MESSAGE_ACTION_TYPE } from 'constants/chat'
import { sendMsg } from 'src/redux/modules/chat'

import { win } from 'utility/globals'

class StructuredMessage extends Component {
  static propTypes = {
    sendMsg: PropTypes.func,
    schema: PropTypes.oneOfType([
      PropTypes.shape(_.assign({ type: PropTypes.string.isRequired }, ButtonCard.schemaPropTypes)),
      PropTypes.shape(_.assign({ type: PropTypes.string.isRequired }, PanelCard.schemaPropTypes)),
      PropTypes.shape(_.assign({ type: PropTypes.string.isRequired }, ListCard.schemaPropTypes))
    ]).isRequired,
    isMobile: PropTypes.bool.isRequired,
    inCarousel: PropTypes.bool
  }

  createAction = ({ type, value }) => {
    const { QUICK_REPLY_ACTION, LINK_ACTION } = CHAT_STRUCTURED_MESSAGE_ACTION_TYPE

    switch (type) {
      case QUICK_REPLY_ACTION:
        return () => {
          this.props.sendMsg(value)
        }
      case LINK_ACTION:
        return () => {
          win.open(value)
        }
      default:
        return undefined
    }
  }

  render() {
    const {
      schema: { type }
    } = this.props
    const CHAT_STRUCTURED_MESSAGE_TYPE = CHAT_STRUCTURED_CONTENT_TYPE.CHAT_STRUCTURED_MESSAGE_TYPE

    switch (type) {
      case CHAT_STRUCTURED_MESSAGE_TYPE.BUTTON_TEMPLATE:
        const { buttons, msg } = this.props.schema

        return (
          <ButtonCard
            buttons={buttons}
            msg={msg}
            createAction={this.createAction}
            isMobile={this.props.isMobile}
          />
        )

      case CHAT_STRUCTURED_MESSAGE_TYPE.PANEL_TEMPLATE:
        return (
          <PanelCard
            {...this.props.schema}
            createAction={this.createAction}
            isMobile={this.props.isMobile}
            inCarousel={this.props.inCarousel}
          />
        )

      case CHAT_STRUCTURED_MESSAGE_TYPE.LIST_TEMPLATE:
        return (
          <ListCard
            {...this.props.schema}
            isMobile={this.props.isMobile}
            createAction={this.createAction}
          />
        )
    }
  }
}

const actionCreators = { sendMsg }

export default connect(
  null,
  actionCreators,
  null,
  { withRef: true }
)(StructuredMessage)
