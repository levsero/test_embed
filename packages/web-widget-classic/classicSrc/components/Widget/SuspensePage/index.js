import LoadingPage from 'classicSrc/components/LoadingPage'
import LoadingPageErrorBoundary from 'classicSrc/components/LoadingPageErrorBoundary'
import PropTypes from 'prop-types'
import { Suspense } from 'react'

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
