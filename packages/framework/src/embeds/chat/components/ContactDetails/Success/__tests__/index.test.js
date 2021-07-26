import Success from 'src/embeds/chat/components/ContactDetails/Success'
import { render } from 'src/util/testHelpers'

const renderComponent = () => {
  return render(<Success />)
}

describe('Contact Details Success Notification', () => {
  it('renders the success text', () => {
    const { getByText } = renderComponent()

    expect(getByText('Success')).toBeInTheDocument()
  })
})
