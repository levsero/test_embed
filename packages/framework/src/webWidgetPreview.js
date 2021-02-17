import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'

import { Container } from 'component/container/Container'
import Frame from 'component/frame/Frame'
import { i18n } from 'src/apps/webWidget/services/i18n'
import { Provider } from 'react-redux'

import createStore from 'src/redux/createStore'
import { updateEmbeddableConfig } from 'src/redux/modules/base'
import { updateSettings } from 'src/redux/modules/settings'
import { generateUserWidgetCSS } from 'utility/color/styles'

import { webWidgetStyles } from 'embed/webWidget/webWidgetStyles'
import { DEFAULT_WIDGET_HEIGHT, WIDGET_WIDTH, WIDGET_MARGIN } from 'src/constants/shared'
import TicketFormPage from 'embeds/support/pages/TicketFormPage'
import { getEmbeddableConfig } from 'src/redux/modules/base/base-selectors'

const FRAME_WIDTH = WIDGET_WIDTH
const FRAME_HEIGHT = DEFAULT_WIDGET_HEIGHT
const BOX_SHADOW_SIZE = 6

const defaultOptions = {
  locale: 'en-US',
  color: { base: '#1F73B7' },
  titleKey: 'message',
  styles: {
    float: 'right',
    marginRight: `${WIDGET_MARGIN}px`,
    marginTop: `${WIDGET_MARGIN}px`,
    width: `${FRAME_WIDTH}px`,
    height: `${FRAME_HEIGHT}px`
  }
}

global.__ZENDESK_CLIENT_I18N_GLOBAL = 'WW_I18N'

let frame

const renderWebWidgetPreview = options => {
  options = _.defaultsDeep({}, options, defaultOptions)

  if (!options.element) {
    throw new Error('A DOM element is required to render the Web Widget Preview into.')
  }

  const color = options.color.base

  const store = createStore()

  i18n.init(store)

  const { width } = options.styles
  const frameStyle = _.extend({}, options.styles, {
    position: 'relative',
    width: `${parseInt(width) + BOX_SHADOW_SIZE * 2}px`
  })
  const containerStyle = {
    width,
    margin: `${BOX_SHADOW_SIZE}px`
  }

  // force name field to be required so "(optional)" does not show in the label
  const embeddableConfig = _.cloneDeep(getEmbeddableConfig(store.getState()))
  embeddableConfig.embeds.ticketSubmissionForm.props.nameFieldRequired = true
  store.dispatch(updateEmbeddableConfig(embeddableConfig))

  store.dispatch(updateSettings({ color: { theme: color, button: color } }))

  const renderComponent = () => {
    const frameParams = {
      rawCSS: `${require('globalCSS')} ${webWidgetStyles}`,
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
            <TicketFormPage match={{ params: { id: 'contact-form' } }} isPreview={true} />
          </Container>
        </Frame>
      </Provider>
    )

    const container = document.createElement('div')

    options.element.appendChild(container)
    ReactDOM.render(component, container)
  }

  i18n.setLocale(options.locale, renderComponent)

  const setColor = newColor => {
    store.dispatch(updateSettings({ color: { theme: newColor, button: newColor } }))
  }

  const setTitle = (titleKey = defaultOptions.titleKey) => {
    const config = {
      embeds: { ticketSubmissionForm: { props: { formTitleKey: titleKey } } }
    }

    store.dispatch(updateEmbeddableConfig(config))
  }

  return {
    setColor,
    setTitle,
    _component: frame
  }
}

window.zE = _.extend(window.zE, { renderWebWidgetPreview })
