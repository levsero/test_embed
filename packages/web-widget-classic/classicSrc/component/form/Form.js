import { TEST_IDS } from 'classicSrc/constants/shared'
import _ from 'lodash'
import PropTypes from 'prop-types'
import { Component } from 'react'

export class Form extends Component {
  static propTypes = {
    formState: PropTypes.object,
    className: PropTypes.string,
    children: PropTypes.node,
    onCompleted: PropTypes.func,
    onChange: PropTypes.func,
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
    submitButtonClasses: '',
  }

  constructor() {
    super()

    this.state = {
      valid: false,
    }

    this.form = null
  }

  componentDidMount = () => {
    this.validate()
  }

  handleFormSubmit = (e) => {
    e.preventDefault()

    this.props.onCompleted(this.props.formState)
  }

  handleFormChange = (e) => {
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
        ref={(el) => (this.form = el)}
        className={this.props.className}
        data-testid={TEST_IDS.FORM}
      >
        {this.props.children}
      </form>
    )
  }
}
