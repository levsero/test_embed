import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { find } from 'styled-components/test-utils'
import createStore from 'src/redux/createStore'
import Title from 'components/Widget/Header/Title'
import * as selectors from 'src/redux/modules/selectors/selectors'
import Header from '../'
import { Container } from '../styles'

describe('Header', () => {
  const defaultProps = {
    title: undefined,
    children: <div>Some child component</div>
  }

  const renderComponent = (props = {}) =>
    render(
      <Provider store={createStore()}>
        <Header {...defaultProps} {...props} />
      </Provider>
    )

  beforeEach(() => {
    jest.spyOn(selectors, 'getShowBackButton').mockReturnValue(true)
  })

  describe('when title is provided', () => {
    let result

    beforeEach(() => {
      result = renderComponent({ title: 'Widget title', children: <div>children</div> })
    })

    it('renders a back button', () => {
      const { queryByLabelText } = result

      expect(queryByLabelText('Back')).toBeInTheDocument()
    })

    it('renders the title is provided', () => {
      const { container } = result

      expect(find(container, Title)).toHaveTextContent('Widget title')
    })

    it('renders a close button', () => {
      const { queryByLabelText } = result

      expect(queryByLabelText('Minimize')).toBeInTheDocument()
    })

    it('renders the children after the title row', () => {
      const { container } = result

      const lastChild = find(container, Container).lastChild

      expect(lastChild).toHaveTextContent('children')
    })
  })

  it('only renders the base Header element when title is not provided', () => {
    const { container } = renderComponent()

    expect(find(container, Title)).not.toBeInTheDocument()
    expect(find(container, Container)).toHaveTextContent('Some child component')
  })
})
