import Success from 'classicSrc/embeds/chat/components/ContactDetails/Success'
import { render } from 'classicSrc/util/testHelpers'

const renderComponent = () => {
  return render(<Success />)
}

describe('Contact Details Success Notification', () => {
  it('renders the success text', () => {
    const { getByText } = renderComponent()

    expect(getByText('Success')).toBeInTheDocument()
  })
})
