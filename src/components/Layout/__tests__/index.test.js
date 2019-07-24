import React from 'react'
import Layout from 'src/components/Layout'
import Header from 'src/components/Header'
import Footer from 'src/components/Footer'
import { Button } from '@zendeskgarden/react-buttons'
import { render } from '@testing-library/react'

const renderLayout = inProps => {
  const defaultProps = {}

  const props = {
    ...defaultProps,
    ...inProps
  }

  return render(
    <Layout {...props}>
      <Header>A title</Header>
      <Footer>
        <Button>Hello Fren</Button>
      </Footer>
    </Layout>
  )
}

describe('Layout Element', () => {
  let result

  beforeEach(() => {
    result = renderLayout()
  })

  it('renders header', () => {
    expect(result.getByText('A title')).toBeInTheDocument()
  })

  it('renders footer', () => {
    expect(result.getByText('Hello Fren')).toBeInTheDocument()
  })

  it('matches snapshot', () => {
    expect(result.container).toMatchSnapshot()
  })
})
