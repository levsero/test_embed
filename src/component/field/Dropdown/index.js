import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import {
  Dropdown as GardenDropdown,
  Field,
  Select,
  Separator,
  Item,
  NextItem,
  PreviousItem,
  Hint,
  Message,
  Menu
} from '@zendeskgarden/react-dropdowns'

import { i18n } from 'service/i18n'
import { FONT_SIZE, TEST_IDS } from 'constants/shared'

import { locals as styles } from './NestedDropdown.scss'
import Node from './OptionNode'
import { getWebWidgetFrameContentWindow } from 'utility/globals'

const findDefaultNode = (names, rootNode) => {
  let currNode = rootNode

  _.forEach(names, (name, i) => {
    currNode = currNode.getChildNode(name)

    if (!currNode) {
      // The default option provided does not reach a selectable item so there should be no default.
      currNode = rootNode
      return false
    }

    if (i === names.length - 1 && currNode.value.slice(-7) !== '-nested') {
      currNode = currNode.parentNode
      return false
    }
  })

  return currNode
}

export default class NestedDropdown extends Component {
  static propTypes = {
    options: PropTypes.array.isRequired,
    label: PropTypes.object.isRequired,
    name: PropTypes.string,
    showError: PropTypes.bool,
    onChange: PropTypes.func,
    description: PropTypes.string,
    required: PropTypes.bool,
    formState: PropTypes.object.isRequired,
    defaultOption: PropTypes.object
  }

  static defaultProps = {
    name: '',
    required: false,
    showError: false,
    description: '',
    onChange: () => {},
    formState: {}
  }

  constructor(props) {
    super()
    const { defaultOption, required, options } = props

    this.rootNode = new Node()
    if (!required) {
      options.unshift({ name: '-', value: '' })
    }

    this.populateGraph(options)

    const names = defaultOption ? defaultOption.name.split('::') : []
    const node = findDefaultNode(names, this.rootNode)

    this.state = {
      selectedValue: defaultOption ? defaultOption.value : '',
      viewableNode: node,
      displayedName: names.length > 0 ? names[names.length - 1] : '-',
      formState: {},
      isOpen: false
    }
  }

  static getDerivedStateFromProps(props, state) {
    const newFormState = props.formState[props.name]
    const formStateChanged = !_.isEqual(newFormState, state.formState)

    if (!!newFormState || state.isOpen || !formStateChanged) return null

    if (formStateChanged) return { formState: newFormState }

    const names = props.defaultOption ? props.defaultOption.name.split('::') : []
    const node = findDefaultNode(names, state.viewableNode)
    let newState = {}

    if (node !== state.viewableNode) {
      return {
        displayedName: _.last(names) || '-',
        selectedValue: props.defaultOption.value,
        viewableNode: node
      }
    }
    if (props.defaultOption) {
      if (props.defaultOption.value !== state.selectedValue) {
        newState.selectedValue = props.defaultOption.value
      }
      if (_.last(names) && _.last(names) !== state.displayedName) {
        newState.displayedName = _.last(names)
      }
    }

    return _.isEmpty(newState) ? null : newState
  }

  populateGraph = optionsList => {
    _.forEach(optionsList, option => {
      const namePath = _.get(option, 'name', '')
      const names = namePath.split('::')

      let currNode = this.rootNode

      _.forEach(names, (name, i) => {
        let childNode = currNode.getChildNode(name)
        const isLastName = i === names.length - 1

        if (!childNode) {
          // Here, we create a value that is non-selectable (i.e not a leaf node) for the child node.
          // Example: If we have ['a', 'b', 'c'] where the array order defines the path in the tree and we are
          // creating a node for 'b', we will use the value: 'a::b--nested' because it is not selectable.
          // Essentially, we are artifically creating a value
          let value = `${names.slice(0, i + 1).join('::')}-nested`

          if (isLastName) {
            // The child node will be selectable (i.e a leaf node) so don't append the `-nested` part.
            // Example: If we have ['a', 'b', 'c'] where the array order defines the path in the tree and we are
            // creating a node for 'c', we will use the current option's value (from Support) because it is selectable.
            value = _.get(option, 'value', '')
          }
          currNode.addChildNode(name, value)
          childNode = currNode.getChildNode(name)
        } else if (isLastName) {
          childNode.value = _.get(option, 'value', '')
        }
        currNode = childNode
      })
    })
  }

  renderCurrentLevelItems = () => {
    const { viewableNode } = this.state
    let items = []

    if (viewableNode.parentNode) {
      const key = `${viewableNode.parentNode.name}--prev`

      const titleItem = (
        <PreviousItem key={key} value={key}>
          {viewableNode.name}
        </PreviousItem>
      )

      items.push(titleItem)
      items.push(<Separator key={`${viewableNode.name}--separator`} />)
    }

    _.forEach(viewableNode.orderedChildren, childName => {
      const child = viewableNode.getChildNode(childName)

      if (child.hasChildren()) {
        items.push(
          <NextItem key={child.name} value={child.name}>
            {child.name}
          </NextItem>
        )
      } else {
        items.push(
          <Item key={child.name} value={child.name} data-testid={TEST_IDS.DROPDOWN_OPTION}>
            {child.name}
          </Item>
        )
      }
    })

    return items
  }

  handleSelectedItem = selectedItem => {
    let selectedValue, displayedName, viewableNode
    let previousViewableNode = this.state.viewableNode

    if (selectedItem.slice(-6) === '--prev') {
      viewableNode = previousViewableNode.parentNode
    } else {
      viewableNode = previousViewableNode.getChildNode(selectedItem)
    }
    displayedName = viewableNode.name

    if (!viewableNode.hasChildren()) {
      selectedValue = viewableNode.value
      viewableNode = previousViewableNode
    } else if (viewableNode.value.slice(-7) !== '-nested') {
      selectedValue = viewableNode.value
    } else {
      selectedValue = ''
      displayedName = ''
    }

    this.setState({ selectedValue, viewableNode, displayedName, selectedItem }, () => {
      this.props.onChange()
    })
  }

  getNextIsOpenState(newState) {
    const isOpen = newState.isOpen !== undefined ? newState.isOpen : this.state.isOpen

    if (!newState.selectedItem) {
      return isOpen
    }

    const { viewableNode } = this.state

    if (
      viewableNode.parentNode &&
      newState.selectedItem === `${viewableNode.parentNode.name}--prev`
    ) {
      return true
    }

    if (viewableNode.getChildNode(newState.selectedItem).hasChildren()) {
      return true
    }

    return isOpen
  }

  render() {
    return (
      <div className={styles.field}>
        <GardenDropdown
          isOpen={this.state.isOpen}
          onStateChange={newState => {
            this.setState({
              ...newState,
              isOpen: this.getNextIsOpenState(newState)
            })
          }}
          selectedItem={this.state.selectedItem}
          onSelect={this.handleSelectedItem}
          validation={this.props.showError ? 'error' : undefined}
          downshiftProps={{
            environment: getWebWidgetFrameContentWindow()
          }}
        >
          <Field>
            {this.props.label}
            <Hint>{this.props.description}</Hint>
            <Select data-testid={TEST_IDS.DROPDOWN_FIELD}>{this.state.displayedName}</Select>

            {this.props.showError && (
              <Message validation="error">
                {i18n.t('embeddable_framework.validation.error.select')}
              </Message>
            )}
          </Field>
          <Menu
            maxHeight={`${240 / FONT_SIZE}rem`}
            style={{
              overflow: 'auto',
              boxShadow: `0 ${10 / FONT_SIZE}rem ${30 / FONT_SIZE}rem 0 rgba(4, 68, 77, 0.15)`
            }}
            data-testid={TEST_IDS.DROPDOWN_OPTIONS}
          >
            {this.renderCurrentLevelItems()}
          </Menu>
        </GardenDropdown>

        {/* hidden field with the selected value so that the form grabs it on submit */}
        <input
          onChange={() => {}}
          className="u-isHidden"
          name={_.toString(this.props.name)}
          required={this.props.required}
          value={this.state.selectedValue}
        />
      </div>
    )
  }
}
