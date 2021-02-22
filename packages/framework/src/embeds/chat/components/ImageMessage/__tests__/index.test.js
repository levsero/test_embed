import { screen } from '@testing-library/dom'
import { render } from 'src/util/testHelpers'

import ImageMessage from '../'

jest.useFakeTimers()

const renderComponent = (props = {}) => {
  const defaultProps = {
    placeholderEl: null,
    onImageLoad: jest.fn(),
    file: {
      lastModified: 0,
      lastDateModified: {},
      name: 'boop',
      size: 100,
      type: 'image/png',
      webkitRelativePage: '',
      url: 'https://mockurl.com',
    },
  }

  return render(<ImageMessage {...defaultProps} {...props} />)
}

describe('when ImageMessage has a placeholder', () => {
  it('renders the placeholder instead of the loading spinner', () => {
    renderComponent({ placeholderEl: <div>placeholder</div> })

    expect(screen.getByText('placeholder')).toBeInTheDocument()
  })
})

describe('when ImageMessage does not have a placeholder', () => {
  it('renders a loading spinner', () => {
    renderComponent()

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })
})

describe('on image load', () => {
  it('fires onImageLoad', () => {
    global.Image = class {
      constructor() {
        setTimeout(() => {
          this.onload()
        }, 100)
      }
    }

    const onImageLoad = jest.fn()
    renderComponent({ onImageLoad })

    jest.runAllTimers()

    expect(onImageLoad).toHaveBeenCalled()
  })

  it('hides the loading spinner', () => {
    global.Image = class {
      constructor() {
        setTimeout(() => {
          this.onload()
        }, 100)
      }
    }

    renderComponent()

    jest.runAllTimers()

    expect(screen.queryByRole('progressBar')).toBeNull()
    expect(screen.getByRole('img')).toBeInTheDocument()
  })
})
