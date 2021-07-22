import PropTypes from 'prop-types'
import { Component } from 'react'
import { ListCard as PureListCard } from 'src/component/shared/StructuredMessage/ListCard'
import { CHAT_STRUCTURED_MESSAGE_ACTION_TYPE } from 'src/constants/chat'
import { Button, ButtonSchemaPropType } from './Button'

const { LINK_ACTION } = CHAT_STRUCTURED_MESSAGE_ACTION_TYPE

const PanelActionPropType = PropTypes.shape({
  type: PropTypes.oneOf([LINK_ACTION]).isRequired,
  value: PropTypes.string.isRequired,
})

export const ItemPropType = PropTypes.shape({
  heading: PropTypes.string.isRequired,
  paragraph: PropTypes.string.isRequired,
  image_url: PropTypes.string,
  action: PanelActionPropType.isRequired,
  isMobile: PropTypes.bool.isRequired,
})

export class ListCard extends Component {
  static propTypes = {
    ...ListCard.schemaPropTypes,
    createAction: PropTypes.func.isRequired,
  }

  static defaultProps = {
    items: [],
    buttons: [],
    isMobile: false,
  }

  static schemaPropTypes = {
    items: PropTypes.arrayOf(ItemPropType).isRequired,
    buttons: PropTypes.arrayOf(ButtonSchemaPropType),
  }

  render() {
    const { createAction } = this.props

    const buttons =
      this.props.buttons &&
      this.props.buttons.map((button, index) => {
        return <Button {...button} key={index} createAction={createAction} />
      })

    const items = this.props.items.map((item) => {
      return {
        ...item,
        onClick: createAction(item.action),
        imageUrl: item.image_url,
        layout: 'thumbnail',
        align: 'right',
        headingLineClamp: 1,
      }
    })

    return <PureListCard items={items} buttons={buttons} isMobile={this.props.isMobile} />
  }
}
