import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'

import SubmitTicket from 'component/submitTicket/SubmitTicket'
import { Container } from 'component/container/Container'
import Frame from 'component/frame/Frame'
import { i18n } from 'service/i18n'
import { settings } from 'service/settings'
import { Provider } from 'react-redux'

import createStore from 'src/redux/createStore'
import { updateEmbeddableConfig } from 'src/redux/modules/base'
import { updateSettings } from 'src/redux/modules/settings'
import { generateUserWidgetCSS } from 'utility/color/styles'

import { webWidgetStyles } from 'embed/webWidget/webWidgetStyles'
import { MAX_WIDGET_HEIGHT, WIDGET_WIDTH, WIDGET_MARGIN } from 'src/constants/shared'

const FRAME_WIDTH = WIDGET_WIDTH + WIDGET_MARGIN
const FRAME_HEIGHT = MAX_WIDGET_HEIGHT + WIDGET_MARGIN
const BOX_SHADOW_SIZE = 6

let submitTicketComponent = null
const defaultOptions = {
  locale: 'en-US',
  color: { base: '#1F73B7' },
  titleKey: 'message',
  styles: {
    float: 'right',
    marginTop: '16px',
    marginRight: '16px',
    width: `${FRAME_WIDTH}px`,
    height: `${FRAME_HEIGHT}px`
  }
}
let frame

const renderWebWidgetPreview = options => {
  options = _.defaultsDeep({}, options, defaultOptions)

  if (!options.element) {
    throw new Error('A DOM element is required to render the Web Widget Preview into.')
  }

  const color = options.color.base

  const store = createStore()

  i18n.init(store)
  i18n.setLocale(options.locale)

  const { width } = options.styles
  const frameStyle = _.extend({}, options.styles, {
    position: 'relative',
    width: `${parseInt(width) + BOX_SHADOW_SIZE * 2}px`
  })
  const containerStyle = {
    width,
    margin: `${BOX_SHADOW_SIZE}px`
  }

  store.dispatch(updateSettings({ color: { theme: color, button: color } }))

  const frameParams = {
    css: `${require('globalCSS')} ${webWidgetStyles}`,
    name: 'webWidgetPreview',
    customFrameStyle: frameStyle,
    alwaysShow: true,
    disableOffsetHorizontal: true,
    preventClose: true,
    generateUserCSS: generateUserWidgetCSS,
    ref: el => {
      frame = el
    },
    fullscreen: false,
    isMobile: false
  }

  const component = (
    <Provider store={store}>
      <Frame {...frameParams} store={store}>
        <Container style={containerStyle}>
          <SubmitTicket
            ref={submitTicket => (submitTicketComponent = submitTicket)}
            viaId={settings.get('viaId')}
            previewEnabled={true}
            submitTicketSender={() => {}}
            attachmentSender={() => {}}
            fullscreen={false}
            style={containerStyle}
            isMobile={false}
          />
        </Container>
      </Frame>
    </Provider>
  )

  const container = document.createElement('div')

  options.element.appendChild(container)
  ReactDOM.render(component, container)

  const setColor = newColor => {
    store.dispatch(updateSettings({ color: { theme: newColor, button: newColor } }))
  }

  const setTitle = (titleKey = defaultOptions.titleKey) => {
    waitForSubmitTicketComponent(() => {
      const config = {
        embeds: { ticketSubmissionForm: { props: { formTitleKey: titleKey } } }
      }

      store.dispatch(updateEmbeddableConfig(config))
    })
  }

  return {
    setColor,
    setTitle,
    _component: frame
  }
}

const getSubmitTicketComponent = () => {
  return submitTicketComponent
}

const waitForSubmitTicketComponent = callback => {
  const component = getSubmitTicketComponent()

  if (component !== null) {
    callback(component)
  } else {
    setTimeout(() => waitForSubmitTicketComponent(callback), 0)
  }
}

window.zE = _.extend(window.zE, { renderWebWidgetPreview })
