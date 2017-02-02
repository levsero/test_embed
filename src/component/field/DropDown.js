import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

import { locals as styles } from './Dropdown.sass';
import { DropdownOption } from 'component/field/DropdownOption';
import { Icon } from 'component/Icon';
import { i18n } from 'service/i18n';

export class Dropdown extends Component {
  static propTypes = {
    options: PropTypes.array.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.object
  }

  static defaultProps = {
    options: [],
    placeholder: '',
    value: {}
  }

  constructor (props) {
    super(props);

    const initialMenu = this.renderDropdownOptions(this.props.options);

    this.state = {
      selected: props.value,
      displayedMenu: initialMenu,
      previousMenu: [],
      open: false
    };

    this.containerClicked = false;
  }

  handleFocus = () => {
    this.setState({ open: !this.state.open });
  }

  handleBlur = () => {
    if (this.containerClicked) {
      this.refs.input.focus();
    }

    this.setState({ open: this.containerClicked });
  }

  handleBackClick = () => {
    this.setState({ displayedMenu: this.state.previousMenu[0] });

    this.state.previousMenu.shift();
  }

  handleContainerClick = () => {
    this.containerClicked = true;
    setTimeout(() => {
      this.containerClicked = false;
    }, 0);
  }

  setValue = (value, title) => () => {
    this.setState({
      selected: { value, title },
      open: false
    });
    this.refs.input.blur();
  }

  updateMenu = (menu) => {
    this.state.previousMenu.unshift(this.state.displayedMenu);

    this.setState({ displayedMenu: menu });
  }

  renderDropdownOptions = (optionsProp) => {
    const options = _.cloneDeep(optionsProp);
    const groupByFn = (option) => {
      return (option.title.indexOf('::') > -1)
           ? option.title.split('::')[0]
           : '';
    };
    const mapFn = (group, key, allGroups) => {
      if (_.isEmpty(key)) {
        return _.map(group, (option) => {
          // Don't return duplicate fields. ie `one` and `one::two`
          if (!_.includes(_.keys(allGroups), option.title)) {
            return (
              <DropdownOption
                title={option.title}
                key={option.title}
                onClick={this.setValue(option.value, option.title)} />
            );
          }
        });
      } else {
        // Remove the groups name from the title value.
        _.forEach(group, (item) => {
          item.title = item.title.substring(item.title.indexOf('::') + 2);
        });

        // And look for further nesting
        const nestedOptions = this.renderDropdownOptions(group);

        return (
          <DropdownOption
            title={key}
            key={key}
            nestedOptions={nestedOptions}
            updateMenu={this.updateMenu} />
        );
      }
    };

    return _.chain(options)
          .groupBy(groupByFn)
          .map(mapFn)
          .value();
  }

  renderBackArrow = () => {
    if (this.state.previousMenu.length === 0) return;

    return (
      <div
        className={`${styles.field} ${styles.back}`}
        onClick={this.handleBackClick}>
        <div className={styles.arrowBack} />
        {i18n.t('embeddable_framework.navigation.back')}
      </div>
    );
  }

  renderMenu = () => {
    if (!this.state.open) return;

    return (
      <div className={styles.menu}>
        {this.renderBackArrow()}
        {this.state.displayedMenu}
      </div>
    );
  }

  renderDropdownArrow = () => {
    const iconOpenClasses = this.state.open ? styles.arrowOpen : '';

    return (
      <Icon type='Icon--caret' className={`${styles.arrow} ${iconOpenClasses}`} />
    );
  }

  render = () => {
    return (
      <div onMouseDown={this.handleContainerClick}>
        <div className={styles.label}>
          {this.props.placeholder}
        </div>
        <div className={styles.container}>
          <input
            ref='input'
            className={styles.input}
            onBlur={this.handleBlur}
            onFocus={this.handleFocus}
            readOnly={true}
            placeholder={this.state.selected.title} />
          {this.renderDropdownArrow()}
          {this.renderMenu()}
        </div>
      </div>
    );
  }
}
