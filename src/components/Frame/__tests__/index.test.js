import React from 'react'
import { render } from '@testing-library/react'
import styled from 'styled-components'
import Frame from '../'

describe('Frame', () => {
  const defaultProps = {
    title: 'Frame test',
    children: <div id="child-component">Child component</div>,
    id: 'frame-test',
    ref: React.createRef()
  }

  const renderComponent = (props = {}) => render(<Frame {...defaultProps} {...props} />)

  const getIFrame = element => element.querySelector('#frame-test').contentDocument

  it('uses the provided title for the iframe', () => {
    const { queryByTitle } = renderComponent()

    expect(queryByTitle('Frame test')).toBeInTheDocument()
  })

  it('renders the provided children inside the iframe', () => {
    const { baseElement } = renderComponent()

    expect(getIFrame(baseElement).querySelector('#child-component')).toBeInTheDocument()
  })

  it('renders into the provided rootElement if provided', () => {
    const div = document.createElement('div')
    document.querySelector('body').appendChild(div)

    renderComponent({ rootElement: div })

    expect(div.querySelector('#child-component')).toBeInTheDocument()
  })

  it('includes a StyleSheetManager so styled-components styles are kept in the iframe', () => {
    const ChildComponent = styled.div`
      color: blue;
    `
    const { baseElement } = renderComponent({ children: <ChildComponent /> })

    expect(
      getIFrame(baseElement)
        .querySelector('head')
        .querySelector('style')
    ).toBeInTheDocument()
  })

  it('forwards the provided ref onto the iframe', () => {
    const ref = React.createRef()
    const { baseElement } = renderComponent({ ref })

    expect(ref.current).toBe(baseElement.querySelector('#frame-test'))
  })

  it('forwards the provided callback ref onto the iframe', () => {
    let current = null
    const ref = iframe => {
      current = iframe
    }
    const { baseElement } = renderComponent({ ref })

    expect(current).toBe(baseElement.querySelector('#frame-test'))
  })
})
