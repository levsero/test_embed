import { render } from '@testing-library/react'
import { CHAT } from 'classicSrc/constants/preview'
import createStore from 'classicSrc/redux/createStore'
import { Provider } from 'react-redux'
import { PreviewContainer } from '../PreviewContainer'

const renderComponent = (props = {}) => {
  const store = createStore()

  const defaultProps = {
    launcherVisible: true,
    webWidgetVisible: false,
    previewChoice: CHAT,
  }
  const mergedProps = { ...defaultProps, ...props }

  return render(
    <Provider store={store}>
      <PreviewContainer {...mergedProps} store={store} />
    </Provider>
  )
}

test('with launcher visible', () => {
  const { container } = renderComponent({
    launcherVisible: true,
    webWidgetVisible: false,
  })

  expect(container).toMatchSnapshot()
})

test('with widget visible', () => {
  const { container } = renderComponent({
    launcherVisible: false,
    webWidgetVisible: true,
  })

  expect(container).toMatchSnapshot()
})
