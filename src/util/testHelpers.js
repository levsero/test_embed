import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import createStore from 'src/redux/createStore'

import { updateTalkEmbeddableConfig } from 'src/redux/modules/talk'
import { GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS } from 'src/redux/modules/chat/chat-action-types'
import { i18n } from 'src/service/i18n'
import thunk from 'redux-thunk'
import reducer from 'src/redux/modules/reducer'
import configureStore from 'redux-mock-store'
import * as chatSelectors from 'src/redux/modules/chat/chat-selectors/selectors'
import { createMemoryHistory } from 'history'
import { render as rtlRender } from '@testing-library/react'
import { Router } from 'react-router-dom'
import { IdManager } from '@zendeskgarden/react-selection'
import { ThemeProvider } from '@zendeskgarden/react-theming'

export const dispatchChatAccountSettings = (store, settings) => {
  store.dispatch({
    type: GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS,
    payload: settings
  })
}

const mockStore = configureStore([thunk])

export const initialState = () => reducer({}, {})
export const createMockStore = state => mockStore(state || initialState())

export const mockZChatVendor = obj => {
  const zChat = obj || jest.fn()
  jest.spyOn(chatSelectors, 'getZChatVendor').mockReturnValue(zChat)
  return zChat
}

export const dispatchUpdateEmbeddableConfig = (store, config) => {
  store.dispatch(updateTalkEmbeddableConfig(config))
}

export const clearDOM = () => {
  document.getElementsByTagName('html')[0].innerHTML = ''
}

export const noopReactComponent = () =>
  class extends Component {
    static propTypes = {
      className: PropTypes.string,
      children: PropTypes.node
    }

    render() {
      return <div className={this.props.className}>{this.props.children}</div>
    }
  }

/*
  For testing reducers (duh).
  Pass it your reducer and an array of parameter objects.
  - If parameter object is a flat action payload, the test will use
  snapshot testing. The action can also be explicitly specified using
  an `action` key.
  - If parameter object contains key `initialState`, the value
  of that key will be used as initial state for the reducer.
  - If parameter object contains key `expected`, the value
  of that key will be used to assert against the result of the reducer.
*/
export const testReducer = (reducer, actions) => {
  actions.forEach(params => {
    const { expected, initialState, extraDesc } = params
    const action = params.action || params
    const basicTestDesc = `${reducer.name}, action: ${action.type}`
    const testDesc = extraDesc ? `${basicTestDesc} ${extraDesc}` : basicTestDesc

    test(testDesc, () => {
      const reduced = reducer(initialState, action)

      if ('expected' in params) {
        expect(reduced).toEqual(expected)
      } else {
        expect(reduced).toMatchSnapshot()
      }
    })
  })
}

/*
  For testing basic translation selectors made using reselect's `createSelector`.
  And by basic, I mean of the i18n.getSettingTranslations(setting) || i18n.t('default.translation') kind.
  The resultFunc needs to have an arity of 2 for the unused locale param.
*/
export const testTranslationStringSelector = selector => {
  const subject = selector.resultFunc
  const defaultTranslation = 'default translation'
  const settingsTranslation = 'settings translation'

  if (!subject || subject.length !== 2) {
    throw new Error('For testing create selector resultFuncs with arity of 2')
  }

  describe(selector.name, () => {
    test.each([
      [undefined, null, defaultTranslation],
      [settingsTranslation, null, settingsTranslation]
    ])('resultFunc(%p, %p) returns %p', (settingString, locale, expected) => {
      jest.spyOn(i18n, 't').mockReturnValue(defaultTranslation)
      jest.spyOn(i18n, 'getSettingTranslation').mockReturnValue(settingString)

      expect(subject(settingString, locale)).toEqual(expected)

      i18n.t.mockRestore()
      i18n.getSettingTranslation.mockRestore()
    })
  })
}

export function render(
  ui,
  { render, store, route = '/', history = createMemoryHistory({ initialEntries: [route] }) } = {}
) {
  IdManager.setIdCounter(0)
  const reduxStore = store || createStore()
  const renderFn = render || rtlRender
  return {
    ...renderFn(
      <Provider store={reduxStore}>
        <ThemeProvider>
          <Router history={history}>{ui}</Router>
        </ThemeProvider>
      </Provider>
    ),
    history,
    store: reduxStore
  }
}
