import { lazy, Suspense } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { getFrameVisible } from 'src/redux/modules/selectors'
import Launcher from 'embeds/webWidget/components/Launcher'
const Embeds = lazy(() =>
  import(/* webpackChunkName: 'lazy/embeds' */ 'src/embeds/webWidget/components/Embeds')
)

const WebWidget = ({ config }) => {
  const isWidgetOpen = useSelector((state) => getFrameVisible(state, 'webWidget'))
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
