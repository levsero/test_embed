import React from 'react'
import PropTypes from 'prop-types'
import Launcher from 'embeds/webWidget/components/Launcher'
import Embeds from 'embeds/webWidget/components/Embeds'

const WebWidget = ({ config }) => {
  return (
    <>
      <Launcher labelKey={config?.embeds?.launcher?.props?.labelKey} />
      <Embeds />
    </>
  )
}

WebWidget.propTypes = {
  config: PropTypes.shape({
    embeds: PropTypes.shape({
      launcher: PropTypes.shape({
        props: PropTypes.shape({
          labelKey: PropTypes.string
        })
      })
    })
  })
}

export default WebWidget
