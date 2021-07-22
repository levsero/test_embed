import classnames from 'classnames'
import { pick } from 'lodash'
import PropTypes from 'prop-types'
import { Component } from 'react'
import { CHAT_STRUCTURED_MESSAGE_ACTION_TYPE } from 'constants/chat'
import { PanelCard as PurePanelCard } from 'src/component/shared/StructuredMessage/PanelCard'
import { Button, ButtonSchemaPropType } from './Button'
import { locals as styles } from './PanelCard.scss'

const { LINK_ACTION } = CHAT_STRUCTURED_MESSAGE_ACTION_TYPE

const PanelActionPropType = PropTypes.shape({
  type: PropTypes.oneOf([LINK_ACTION]).isRequired,
  value: PropTypes.string.isRequired,
})

const PanelPropType = PropTypes.shape({
  heading: PropTypes.string.isRequired,
  paragraph: PropTypes.string,
  image_url: PropTypes.string,
  action: PanelActionPropType,
})

export class PanelCard extends Component {
  static propTypes = {
    ...PanelCard.schemaPropTypes,
    createAction: PropTypes.func.isRequired,
    isMobile: PropTypes.bool.isRequired,
    inCarousel: PropTypes.bool,
  }

  static defaultProps = {
    buttons: [],
    inCarousel: false,
  }

  static schemaPropTypes = {
    panel: PanelPropType,
    buttons: PropTypes.arrayOf(ButtonSchemaPropType),
  }

  render() {
    const { createAction } = this.props

    const buttons =
      this.props.buttons &&
      this.props.buttons.map((button, index) => {
        return <Button {...button} key={index} createAction={createAction} />
      })

    const panelProp = {
      ...pick(this.props.panel, ['heading', 'paragraph']),
      imageUrl: this.props.panel.image_url,
      onClick: this.props.panel.action ? createAction(this.props.panel.action) : null,
    }

    const cardClassName = classnames({
      [styles.mobileInCarousel]: this.props.inCarousel && this.props.isMobile,
      [styles.mobile]: !this.props.inCarousel && this.props.isMobile,
    })

    return (
      <PurePanelCard panel={panelProp} className={cardClassName}>
        {buttons}
      </PurePanelCard>
    )
  }
}
