import { find } from 'styled-components/test-utils'
import render from 'src/utils/test/render'
import Carousel from 'src/Carousel'
import { Heading } from 'src/Carousel/styles'
import { Image } from 'src/Avatar/styles'

describe('Carousel', () => {
  const defaultProps = {
    items: [
      {
        _id: 'item-1',
        title: 'Item 1 title',
        description: 'Item 1 description',
        actions: [
          {
            _id: 'item-1-action-1',
            uri: 'https://www.example.com/1',
            text: 'Item 1 action 1'
          }
        ]
      },
      {
        _id: 'item-2',
        title: 'Item 2 title',
        description: 'Item 2 description',
        actions: [
          {
            _id: 'item-2-action-1',
            uri: 'https://www.example.com/2',
            text: 'Item 2 action 1'
          }
        ]
      }
    ],
    label: 'Some name',
    avatar: 'www.example.com/cat.jpg'
  }

  const renderComponent = (props = {}) => render(<Carousel {...defaultProps} {...props} />)

  it('renders the the label if provided', () => {
    const { getByText, container } = renderComponent({ label: 'Some name' })

    expect(find(container, Heading)).toBeInTheDocument()
    expect(getByText('Some name')).toBeInTheDocument()
  })

  it('does not render the label if not provided', () => {
    const { container } = renderComponent({ label: undefined })

    expect(find(container, Heading)).not.toBeInTheDocument()
  })

  it('renders an avatar if provided', () => {
    const { container } = renderComponent({ avatar: 'www.example.com/cat.jpg' })

    expect(find(container, Image)).toBeInTheDocument()
  })

  it('does not render an avatar if not provided', () => {
    const { container } = renderComponent({ avatar: undefined })

    expect(find(container, Image)).not.toBeInTheDocument()
  })

  it('renders each item as a slide', () => {
    const { getByText } = renderComponent()

    expect(getByText('Item 1 title')).toBeInTheDocument()
    expect(getByText('Item 1 description')).toBeInTheDocument()
    expect(getByText('Item 2 title')).toBeInTheDocument()
    expect(getByText('Item 2 description')).toBeInTheDocument()
  })

  it('opens the link in a new tab when clicked', () => {
    const { getByText } = renderComponent()

    expect(getByText('Item 1 action 1').href).toBe('https://www.example.com/1')
    expect(getByText('Item 1 action 1').target).toBe('_blank')
  })
})
