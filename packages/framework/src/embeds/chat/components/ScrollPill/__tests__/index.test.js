import { fireEvent } from '@testing-library/react'
import { styleSheetSerializer } from 'jest-styled-components/serializer'
import snapshotDiff from 'snapshot-diff'

import { render } from 'src/util/testHelpers'
import ScrollPill from '../index'

snapshotDiff.setSerializers([...snapshotDiff.defaultSerializers, styleSheetSerializer])
expect.addSnapshotSerializer(styleSheetSerializer)

const onClick = jest.fn()
const renderComponent = (inProps) => {
  const props = {
    notificationCount: 1,
    onClick,
    isMobile: false,
    ...inProps,
  }

  return render(<ScrollPill {...props} />)
}

describe('render', () => {
  it('renders label', () => {
    const { getByText } = renderComponent()

    expect(getByText('1 new message')).toBeInTheDocument()
  })

  it('renders the icon', () => {
    const { getByTestId } = renderComponent()

    expect(getByTestId('Icon--arrow-down')).toBeInTheDocument()
  })

  describe('onClick', () => {
    it('fires onClick', () => {
      const { getByText } = renderComponent()

      fireEvent.click(getByText('1 new message'))

      expect(onClick).toHaveBeenCalled()
    })
  })

  describe('when notificationCount is greater than 1', () => {
    it('renders many messages notification', () => {
      const { getByText } = renderComponent({ notificationCount: 2 })

      expect(getByText('2 new messages')).toBeInTheDocument()
    })
  })
})
