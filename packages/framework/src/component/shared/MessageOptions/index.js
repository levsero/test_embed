import classNames from 'classnames'
import PropTypes from 'prop-types'
import { Component } from 'react'
import { KeyboardFocusButton } from 'src/component/shared/KeyboardFocusButton'
import { TEST_IDS } from 'src/constants/shared'
import { locals as styles } from './MessageOptions.scss'

export class MessageOptions extends Component {
  static propTypes = {
    optionItemClasses: PropTypes.string,
    optionItems: PropTypes.array,
    onOptionClick: PropTypes.func,
    isMessageBubbleLinked: PropTypes.bool,
  }

  static defaultProps = {
    optionItems: [],
    onOptionClick: () => {},
    isMessageBubbleLinked: false,
  }

  render() {
    const optionElems = this.props.optionItems.map((child, index) => {
      const childClasses = classNames(
        styles.button,
        styles.optionItem,
        this.props.optionItemClasses,
        {
          [styles.firstItemBorders]: index === 0 && !this.props.isMessageBubbleLinked,
        }
      )

      return (
        <KeyboardFocusButton
          key={index}
          className={childClasses}
          onClick={() => this.props.onOptionClick(child)}
        >
          <div data-testid={TEST_IDS.MESSAGE_OPTION}>{child}</div>
        </KeyboardFocusButton>
      )
    })

    return <ul>{optionElems}</ul>
  }
}
