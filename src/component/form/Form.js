import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

export class Form extends Component {
  static propTypes = {
    formState: PropTypes.object,
    className: PropTypes.string,
    children: PropTypes.node,
    onCompleted: PropTypes.func,
    onChange: PropTypes.func,
    testId: PropTypes.string
  }

  static defaultProps = {
    formState: {},
    className: '',
    children: null,
    rtl: false,
    isMobile: false,
    submitButtonLabel: '',
    onCompleted: () => {},
    onChange: () => {},
    submitButtonClasses: ''
  }

  constructor() {
    super()

    this.state = {
      valid: false
    }

    this.form = null
  }

  componentDidMount = () => {
    this.validate()
  }

  handleFormSubmit = e => {
    e.preventDefault()

    this.props.onCompleted(this.props.formState)
  }

  handleFormChange = e => {
    const { name, value } = e.target
    const fieldState = { [name]: value }
    const formState = { ...this.props.formState, ...fieldState }

    this.validate()
    this.props.onChange(formState)
  }

  isFormValid = () => {
    return this.form.checkValidity() && !_.isEmpty(this.props.formState)
  }

  validate() {
    this.setState({ valid: this.isFormValid() })
  }

  render = () => {
    return (
      <form
        noValidate={true}
        onSubmit={this.handleFormSubmit}
        onChange={this.handleFormChange}
        ref={el => (this.form = el)}
        className={this.props.className}
        data-testid={this.props.testId}
      >
        {this.props.children}
      </form>
    )
  }
}
