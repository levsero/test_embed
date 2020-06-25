import React from 'react'
import { render } from 'utility/testHelpers'
import Attachment from '../'
import snapshotDiff from 'snapshot-diff'
import { fireEvent } from '@testing-library/react'

describe('Attachment', () => {
  const renderComponent = (props = {}) => {
    const attachment = {
      id: '123',
      fileName: 'text.txt',
      fileSize: 20000,
      uploading: false,
      uploadProgress: 100,
      ...props.attachment
    }
    const defaultProps = {
      handleRemoveAttachment: jest.fn(),
      icon: 'Icon--preview-document',
      ...props
    }

    return render(<Attachment {...defaultProps} attachment={attachment} />)
  }

  it('renders the document name', () => {
    const { queryByText } = renderComponent()
    expect(queryByText('text.txt')).toBeInTheDocument()
  })

  it('renders the document size', () => {
    const { queryByText } = renderComponent()
    expect(queryByText('20 KB')).toBeInTheDocument()
  })

  it('renders the close button', () => {
    const { getByRole } = renderComponent()
    expect(getByRole('button')).toBeInTheDocument()
  })

  it('when uploading renders the uploading state', () => {
    const finishedUploading = renderComponent().container
    const uploading = renderComponent({
      attachment: { uploading: true, uploadProgress: 50 }
    }).container

    expect(snapshotDiff(finishedUploading, uploading, { contextLines: 0 })).toMatchInlineSnapshot(`
      Snapshot Diff:
      - First value
      + Second value

      @@ -34,1 +34,1 @@
      -             20 KB
      +             Uploading...
      @@ -58,0 +58,8 @@
      +       </div>
      +       <div
      +         class="sc-htoDjs eTMavl"
      +       >
      +         <div
      +           class="sc-dnqmqq dxumBh"
      +           data-testid="progress-bar"
      +         />
    `)
  })

  it('clicking the close button fires handleRemoveAttachment', () => {
    const close = jest.fn()
    const { getByRole } = renderComponent({ handleRemoveAttachment: close })
    fireEvent.click(getByRole('button'))
    expect(close).toHaveBeenCalledWith('123')
  })
})
