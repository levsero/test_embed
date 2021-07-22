import PropTypes from 'prop-types'
import { Suspense } from 'react'
import LoadingPage from 'src/components/LoadingPage'
import LoadingPageErrorBoundary from 'src/components/LoadingPageErrorBoundary'

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
