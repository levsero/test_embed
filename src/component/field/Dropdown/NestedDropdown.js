import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  SelectField,
  Select,
  Separator,
  Item,
  NextItem,
  PreviousItem,
  Hint,
  Message } from '@zendeskgarden/react-select';
import { Icon } from 'component/Icon';

import { i18n } from 'service/i18n';
import { FONT_SIZE } from 'constants/shared';

import { locals as styles } from './NestedDropdown.scss';
import Node from './OptionNode';

export class NestedDropdown extends Component {
  static propTypes = {
    getFrameContentDocument: PropTypes.func.isRequired,
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
    getFrameContentDocument: () => ({}),
    formState: {}
  }

  constructor(props) {
    super();
    const { defaultOption } = props;

    this.rootNode = new Node();
    this.populateGraph(props.options);

    const names = defaultOption ? defaultOption.name.split('::') : [];
    const node = this.findDefaultNode(names);

    this.state = {
      selectedValue: defaultOption ? defaultOption.value : '',
      viewableNode: node,
      displayedName: names.length > 0 ? names[names.length - 1] : '-'
    };
  }

  componentWillReceiveProps = (nextProps) => {
    const { name, defaultOption } = this.props;
    const newDropdownVal = nextProps.formState[name];
    const oldDropdownVal = this.props.formState[name];

    if (newDropdownVal === oldDropdownVal || this.state.isOpen || !!newDropdownVal) return;

    const names = defaultOption ? defaultOption.name.split('::') : [];
    const node = this.findDefaultNode(names);

    this.setState({
      selectedValue: defaultOption ? defaultOption.value : '',
      viewableNode: node,
      displayedName: names.length > 0 ? names[names.length - 1] : '-'
    });
  }

  findDefaultNode = (names) => {
    let currNode = this.rootNode;

    _.forEach(names, (name, i) => {
      currNode = currNode.getChildNode(name);

      if (!currNode) { // The default option provided does not reach a selectable item so there should be no default.
        currNode = this.rootNode;
        return false;
      }

      if (i === names.length - 1 && currNode.value.slice(-7) !== '-nested') {
        currNode = currNode.parentNode;
        return false;
      }
    });

    return currNode;
  }

  populateGraph = (optionsList) => {
    _.forEach(optionsList, (option) => {
      const namePath = _.get(option, 'name', '');
      const names = namePath.split('::');

      let currNode = this.rootNode;

      _.forEach(names, (name, i) => {
        let childNode = currNode.getChildNode(name);
        const isLastName = i === names.length - 1;

        if (!childNode) {
          // Here, we create a value that is non-selectable (i.e not a leaf node) for the child node.
          // Example: If we have ['a', 'b', 'c'] where the array order defines the path in the tree and we are
          // creating a node for 'b', we will use the value: 'a::b--nested' because it is not selectable.
          // Essentially, we are artifically creating a value
          let value = `${names.slice(0, i+1).join('::')}-nested`;

          if (isLastName) {
            // The child node will be selectable (i.e a leaf node) so don't append the `-nested` part.
            // Example: If we have ['a', 'b', 'c'] where the array order defines the path in the tree and we are
            // creating a node for 'c', we will use the current option's value (from Support) because it is selectable.
            value = _.get(option, 'value', '');
          }
          currNode.addChildNode(name, value);
          childNode = currNode.getChildNode(name);
        } else if (isLastName) {
          childNode.value = _.get(option, 'value', '');
        }
        currNode = childNode;
      });
    });
  }

  renderCurrentLevelItems = () => {
    const { viewableNode } = this.state;
    let items = [];

    if (viewableNode.parentNode) {
      const titleItem = (
        <PreviousItem key={`${viewableNode.parentNode.name}--prev`}>
          <Icon type='Icon--previous' className={styles.previous} />
          {viewableNode.name}
        </PreviousItem>
      );

      items.push(titleItem);
      items.push(<Separator key={`${viewableNode.name}--separator`} />);
    }

    _.forEach(viewableNode.orderedChildren, (childName) => {
      const child = viewableNode.getChildNode(childName);

      if (child.hasChildren()) {
        items.push(<NextItem key={child.name}>{child.name}</NextItem>);
      } else {
        items.push(<Item key={child.name}>{child.name}</Item>);
      }
    });

    return items;
  }

  handleSelectedItem = (selectedKey) => {
    let selectedValue, displayedName, viewableNode;
    let previousViewableNode = this.state.viewableNode;

    if (selectedKey.slice(-6) === '--prev') {
      viewableNode = previousViewableNode.parentNode;
    } else {
      viewableNode = previousViewableNode.getChildNode(selectedKey);
    }
    displayedName = viewableNode.name;

    if (!viewableNode.hasChildren()) {
      selectedValue = viewableNode.value;
      viewableNode = previousViewableNode;
    } else if (viewableNode.value.slice(-7) !== '-nested'){
      selectedValue = viewableNode.value;
    } else {
      selectedValue = '';
      displayedName = '';
    }

    this.setState({ selectedValue, viewableNode, displayedName });
    setTimeout(this.props.onChange, 0);
  }

  render() {
    return (
      <div className={styles.field}>
        <SelectField>
          {this.props.label}
          <Hint>{this.props.description}</Hint>
          <Select
            isOpen={this.state.isOpen}
            appendToNode={this.props.getFrameContentDocument().body}
            onStateChange={newState => this.setState(newState)}
            onChange={this.handleSelectedItem}
            options={this.renderCurrentLevelItems()}
            validation={this.props.showError ? 'error': 'none'}
            dropdownProps={{
              style: {
                maxHeight: `${240/FONT_SIZE}rem`,
                overflow: 'auto',
                boxShadow: `0 ${10/FONT_SIZE}rem ${30/FONT_SIZE}rem 0 rgba(4, 68, 77, 0.15)`
              }
            }}>
            {this.state.displayedName}
          </Select>
          {this.props.showError &&
            <Message validation='error'>
              {i18n.t('embeddable_framework.validation.error.select')}
            </Message>}
        </SelectField>
        {/* hidden field with the selected value so that the form grabs it on submit */}
        <input
          onChange={() => {}}
          className='u-isHidden'
          name={_.toString(this.props.name)}
          required={this.props.required}
          value={this.state.selectedValue} />
      </div>
    );
  }
}
