import PropTypes from 'prop-types'
import { Component } from 'react'
import { locals as styles } from './ButtonCard.scss'
import { ButtonList } from './pure/ButtonList'
import { Card } from './pure/Card'

export class ButtonCard extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    message: PropTypes.string,
    className: PropTypes.string,
  }

  static defaultProps = {
    message: '',
  }

  render() {
    const { message, children, className } = this.props

    return (
      <Card className={className}>
        <div className={styles.message}>{message}</div>
        <ButtonList>{children}</ButtonList>
      </Card>
    )
  }
}
