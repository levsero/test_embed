import { Suspense } from 'react'
import PropTypes from 'prop-types'

import LoadingPageErrorBoundary from 'src/components/LoadingPageErrorBoundary'
import LoadingPage from 'src/components/LoadingPage'

const SuspensePage = ({ children }) => {
  return (
    <LoadingPageErrorBoundary>
      <Suspense fallback={<LoadingPage />}>{children}</Suspense>
    </LoadingPageErrorBoundary>
  )
}

SuspensePage.propTypes = {
  children: PropTypes.node,
}

export default SuspensePage
