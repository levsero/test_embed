import { render } from 'src/util/testHelpers'
import { Component as OfflinePage } from '../index'

describe('OfflineMessage', () => {
  it('renders a label explaining that talk is offline', () => {
    const { container } = render(
      <OfflinePage message="Offline message" title={'title'} hideZendeskLogo={false} />
    )

    expect(container).toMatchSnapshot()
  })
})
