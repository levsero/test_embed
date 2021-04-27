import { lazy, Suspense, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { getFrameVisible } from 'src/redux/modules/selectors'
import Launcher from 'embeds/webWidget/components/Launcher'
import isFeatureEnabled from 'src/embeds/webWidget/selectors/feature-flags/index'
const Embeds = lazy(() =>
  import(/* webpackChunkName: 'lazy/embeds' */ 'src/embeds/webWidget/components/Embeds')
)

const WebWidget = ({ config }) => {
  const isWidgetOpen = useSelector((state) => getFrameVisible(state, 'webWidget'))
  const isEarlyPrefetchEnabled = useSelector((state) =>
    isFeatureEnabled(state, 'web_widget_prefetch_widget_container')
  )

  useEffect(() => {
    if (isEarlyPrefetchEnabled) {
      import(
        /* webpackPrefetch: true */ /* webpackChunkName: 'lazy/embeds' */ 'src/embeds/webWidget/components/Embeds'
      )
    }
  }, [])

  return (
    <>
      <Launcher labelKey={config?.embeds?.launcher?.props?.labelKey} />
      <Suspense fallback={<span />}>{isWidgetOpen && <Embeds />}</Suspense>
    </>
  )
}

WebWidget.propTypes = {
  config: PropTypes.shape({
    embeds: PropTypes.shape({
      launcher: PropTypes.shape({
        props: PropTypes.shape({
          labelKey: PropTypes.string,
        }),
      }),
    }),
  }),
}

export default WebWidget
