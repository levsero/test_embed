import React from 'react'
import MessagePage from 'src/apps/messenger/features/widget/components/MessagePage'
import { render } from 'src/apps/messenger/utils/testHelpers'
import { screenDimensionsChanged } from 'src/apps/messenger/features/responsiveDesign/store'
import { find } from 'styled-components/test-utils'
import { Container } from 'src/apps/messenger/features/widget/styles'
import { companyReceived } from 'src/apps/messenger/store/company'

describe('MessagePage', () => {
  const renderComponent = () => render(<MessagePage />)

  it('renders the header', () => {
    const { getByText, store } = renderComponent()
    store.dispatch(companyReceived({ name: 'Company name' }))

    expect(getByText('Company name')).toBeInTheDocument()
  })

  it('has a box shadow when not in fullscreen mode', () => {
    const { store, container } = renderComponent()
    store.dispatch(
      screenDimensionsChanged({
        isVerticallySmallScreen: true,
        isHorizontallySmallScreen: true
      })
    )

    expect(find(container, Container)).not.toHaveStyleRule('margin', '5px')
    expect(find(container, Container)).not.toHaveStyleRule('box-shadow')

    store.dispatch(
      screenDimensionsChanged({
        isVerticallySmallScreen: false,
        isHorizontallySmallScreen: false
      })
    )

    expect(find(container, Container)).toHaveStyleRule('margin', '5px')
    expect(find(container, Container)).toHaveStyleRule('box-shadow', '0 0 5px 0 rgba(0,0,0,0.6)')
  })
})
