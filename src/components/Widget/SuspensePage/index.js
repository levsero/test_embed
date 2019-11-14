import React, { Suspense } from 'react'
import PropTypes from 'prop-types'

import ErrorBoundary from 'src/components/ErrorBoundary'
import LoadingPage from 'src/components/LoadingPage'

const SuspensePage = ({ children }) => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingPage />}>{children}</Suspense>
    </ErrorBoundary>
  )
}

SuspensePage.propTypes = {
  children: PropTypes.node
}

export default SuspensePage
