import PropTypes from 'prop-types'
import { Component } from 'react'
import { ButtonList } from './pure/ButtonList'
import { Card } from './pure/Card'
import { Panel, PanelPropType } from './pure/Panel'

export class PanelCard extends Component {
  static propTypes = {
    panel: PanelPropType,
    children: PropTypes.node,
    className: PropTypes.string,
  }

  static defaultProps = {
    children: [],
    panel: {
      roundedTop: true,
    },
  }

  render() {
    const panel = { ...PanelCard.defaultProps.panel, ...this.props.panel }

    panel.roundedBottom = this.props.children.length === 0

    return (
      <Card className={this.props.className}>
        <Panel panel={panel} />
        <ButtonList>{this.props.children}</ButtonList>
      </Card>
    )
  }
}
