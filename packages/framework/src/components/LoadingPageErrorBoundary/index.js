import React, { Component } from 'react'
import PropTypes from 'prop-types'
import LoadingPage from 'src/components/LoadingPage'
import errorTracker from 'src/framework/services/errorTracker'

export default class LoadingPageErrorBoundary extends Component {
  static getDerivedStateFromError(_error) {
    return { hasError: true }
  }

  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  componentDidCatch(error, errorInfo) {
    errorTracker.error(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // showing an endless spinner until we decide to handle errors better
      return <LoadingPage />
    }

    return this.props.children
  }
}

LoadingPageErrorBoundary.propTypes = {
  children: PropTypes.node,
}

LoadingPageErrorBoundary.defaultProps = {
  children: [],
}
