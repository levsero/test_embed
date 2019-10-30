import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Field, MediaInput } from '@zendeskgarden/react-forms'
import { TEST_IDS } from 'src/constants/shared'
import { LoadingDots, SearchIcon, ClearInputButton, Container } from './styles'
import { triggerOnEnter } from 'utility/keyboard'

export default class SearchField extends Component {
  static propTypes = {
    isLoading: PropTypes.bool,
    onChangeValue: PropTypes.func,
    searchPlaceholder: PropTypes.string.isRequired,
    value: PropTypes.string
  }

  static defaultProps = {
    isLoading: false,
    onChangeValue: () => {},
    value: ''
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      focused: false,
      value: props.value
    }
    this.searchField = null
  }

  onFocus = () => {
    this.setState({ focused: true })
  }

  onBlur = () => {
    this.setState({ focused: false })
  }

  onChange = e => {
    const value = e.target.value

    this.setState({ value })
    this.props.onChangeValue(value)
  }

  clearInput = () => {
    this.setState({
      value: ''
    })
    this.props.onChangeValue('')
    this.focus()
  }

  focus = () => {
    this.searchField.focus()
  }

  clearInputButton = () => {
    return (
      <ClearInputButton
        onClick={this.clearInput}
        role="button"
        cursor="pointer"
        data-testid={TEST_IDS.ICON_CLEAR_INPUT}
        tabIndex="0"
        onKeyDown={triggerOnEnter(this.clearInput)}
      />
    )
  }

  renderIcon = () => {
    let icon = null

    if (this.props.isLoading) {
      icon = <LoadingDots data-testid={TEST_IDS.ICON_ELLIPSIS} />
    } else if (this.state.value) {
      icon = this.clearInputButton()
    }

    return <div key="clearInputOrLoading">{icon}</div>
  }

  render = () => {
    const { searchPlaceholder } = this.props

    return (
      <Container>
        <Field>
          <MediaInput
            start={<SearchIcon data-testid={TEST_IDS.ICON_SEARCH} />}
            end={this.renderIcon()}
            onChange={this.onChange}
            value={this.state.value}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            ref={elem => {
              this.searchField = elem
            }}
            placeholder={searchPlaceholder}
            data-testid={TEST_IDS.SEARCH_FIELD}
            type="search"
            autoCapitalize="off"
          />
        </Field>
      </Container>
    )
  }
}
