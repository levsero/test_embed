import Launcher from 'classicSrc/embeds/webWidget/components/Launcher'
import { getFrameVisible } from 'classicSrc/redux/modules/selectors'
import PropTypes from 'prop-types'
import { lazy, Suspense } from 'react'
import { useSelector } from 'react-redux'
import isFeatureEnabled from '@zendesk/widget-shared-services/feature-flags'

const Embeds = lazy(() =>
  import(/* webpackChunkName: 'lazy/embeds' */ 'classicSrc/embeds/webWidget/components/Embeds')
)

const WebWidget = ({ config }) => {
  const isWidgetOpen = useSelector((state) => getFrameVisible(state, 'webWidget'))
  const isEarlyPrefetchEnabled = useSelector((state) =>
    isFeatureEnabled(state, 'web_widget_prefetch_widget_container')
  )

  return (
    <>
      <Launcher labelKey={config?.embeds?.launcher?.props?.labelKey} />
      <Suspense fallback={<span />}>
        {(isEarlyPrefetchEnabled || isWidgetOpen) && <Embeds />}
      </Suspense>
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
